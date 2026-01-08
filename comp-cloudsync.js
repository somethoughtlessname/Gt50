(function() {
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.CloudSync = {
        // Storage keys
        STORAGE_KEY_TOKEN: 'gt50-github-token',
        STORAGE_KEY_GIST_ID: 'gt50-gist-id',
        STORAGE_KEY_ENABLED: 'gt50-sync-enabled',
        STORAGE_KEY_CAN_PUSH: 'gt50-can-push',
        STORAGE_KEY_LAST_MODIFIED: 'gt50-last-modified',
        STORAGE_KEY_LAST_SYNC: 'gt50-last-sync',
        
        // State
        syncInterval: null,
        countdownInterval: null,
        isSyncing: false,
        syncStatus: 'idle',
        syncMessage: '',
        secondsUntilSync: 0,
        
        // Default state
        defaultState: function() {
            return {
                enabled: localStorage.getItem(this.STORAGE_KEY_ENABLED) === 'true',
                canPush: localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true'
            };
        },
        
        // Mark that user made a change
        markAsModified: function() {
            if (this.isSyncing) return; // Don't mark during sync
            localStorage.setItem(this.STORAGE_KEY_LAST_MODIFIED, new Date().toISOString());
        },
        
        // Enable/disable sync
        setEnabled: function(enabled) {
            localStorage.setItem(this.STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
            if (enabled) {
                this.startAutoSync();
            } else {
                this.stopAutoSync();
            }
        },
        
        // Enable/disable push
        setCanPush: function(canPush) {
            localStorage.setItem(this.STORAGE_KEY_CAN_PUSH, canPush ? 'true' : 'false');
        },
        
        // Save credentials
        saveCredentials: function(token, gistId) {
            localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
            localStorage.setItem(this.STORAGE_KEY_GIST_ID, gistId);
        },
        
        // Start auto-sync
        startAutoSync: function() {
            if (this.syncInterval) return;
            
            console.log('🔄 Starting auto-sync (60s interval)');
            
            this.secondsUntilSync = 60;
            
            // Initial sync
            this.smartSync();
            
            // Countdown timer (every second)
            this.countdownInterval = setInterval(() => {
                this.secondsUntilSync = Math.max(0, this.secondsUntilSync - 1);
            }, 1000);
            
            // Sync timer (every 60 seconds)
            this.syncInterval = setInterval(() => {
                this.secondsUntilSync = 60;
                this.smartSync();
            }, 60000);
        },
        
        // Stop auto-sync
        stopAutoSync: function() {
            if (this.syncInterval) clearInterval(this.syncInterval);
            if (this.countdownInterval) clearInterval(this.countdownInterval);
            this.syncInterval = null;
            this.countdownInterval = null;
            this.secondsUntilSync = 0;
        },
        
        // Get cloud state from GitHub
        getCloudState: async function(token, gistId) {
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.github+json'
                }
            });
            
            if (!response.ok) {
                if (response.status === 404) return null;
                throw new Error(`GitHub API error: ${response.status}`);
            }
            
            const gist = await response.json();
            const file = gist.files['gt50-state.json'];
            if (!file) return null;
            
            return JSON.parse(file.content);
        },
        
        // Push to cloud
        pushToCloud: async function(token, gistId, state) {
            // Prepare data
            const data = {
                version: "1.0",
                timestamp: new Date().toISOString(),
                app: "GT50",
                data: {
                    tabs: state.tabs,
                    tabComponents: state.tabComponents
                }
            };
            
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json'
                },
                body: JSON.stringify({
                    files: {
                        'gt50-state.json': {
                            content: JSON.stringify(data, null, 2)
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Push failed: ${response.status}`);
            }
            
            console.log('✅ Pushed to cloud');
        },
        
        // Pull from cloud
        pullFromCloud: async function(cloudData) {
            console.log('📥 Pulling from cloud...');
            
            // Import the data
            const text = JSON.stringify(cloudData);
            const result = GT50Lib.ImpEx.importData(text);
            
            if (!result.success) {
                throw new Error('Import failed: ' + result.error);
            }
            
            // Get current state
            const stateStr = localStorage.getItem('gt50-tester-state');
            if (!stateStr) {
                throw new Error('No local state found');
            }
            
            const state = JSON.parse(stateStr);
            
            // Update with pulled data
            state.tabs = result.data.tabs;
            state.tabComponents = result.data.tabComponents;
            state.timestamp = cloudData.timestamp;
            
            // Reset navigation
            if (typeof window !== 'undefined') {
                window.nextId = Date.now();
                window.navigationStack = [];
                window.scrollStack = [];
            }
            
            // Reset header
            if (!state.header) state.header = GT50Lib.Header.defaultState();
            state.header.isMain = true;
            state.header.title = 'GT50 TESTER';
            state.impex.isOpen = false;
            
            // Save everything
            localStorage.setItem('gt50-tester-state', JSON.stringify(state));
            localStorage.setItem(this.STORAGE_KEY_LAST_MODIFIED, cloudData.timestamp);
            localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
            
            // Render (isSyncing still true prevents markAsModified)
            if (typeof window !== 'undefined' && window.render) {
                window.render(true);
            }
            
            console.log('✅ Pull complete');
        },
        
        // Smart sync - compares timestamps and decides push/pull/skip
        smartSync: async function() {
            if (this.isSyncing) {
                console.log('⏸️ Already syncing');
                return;
            }
            
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            const canPush = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
            
            if (!token || !gistId) return;
            
            try {
                this.isSyncing = true;
                this.syncStatus = 'syncing';
                
                // Get local state
                const stateStr = localStorage.getItem('gt50-tester-state');
                if (!stateStr) {
                    this.isSyncing = false;
                    return;
                }
                const state = JSON.parse(stateStr);
                
                // Get cloud state
                const cloudState = await this.getCloudState(token, gistId);
                
                // PULL-ONLY MODE
                if (!canPush) {
                    if (!cloudState) {
                        this.syncStatus = 'idle';
                        this.syncMessage = 'No cloud data';
                        this.isSyncing = false;
                        return;
                    }
                    
                    const cloudTime = new Date(cloudState.timestamp || 0).getTime();
                    const localTime = new Date(state.timestamp || 0).getTime();
                    
                    if (cloudTime > localTime) {
                        console.log('📥 PULL-ONLY: Pulling');
                        await this.pullFromCloud(cloudState);
                        this.syncStatus = 'success';
                        this.syncMessage = 'Pulled';
                    } else {
                        this.syncStatus = 'success';
                        this.syncMessage = 'Up to date';
                    }
                    this.isSyncing = false;
                    return;
                }
                
                // TWO-WAY SYNC
                
                // No cloud data? Push initial
                if (!cloudState) {
                    console.log('📤 Initial push');
                    await this.pushToCloud(token, gistId, state);
                    const now = new Date().toISOString();
                    state.timestamp = now;
                    localStorage.setItem('gt50-tester-state', JSON.stringify(state));
                    localStorage.setItem(this.STORAGE_KEY_LAST_MODIFIED, now);
                    localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, now);
                    this.syncStatus = 'success';
                    this.syncMessage = 'Pushed';
                    this.isSyncing = false;
                    return;
                }
                
                // Get timestamps
                const cloudTime = new Date(cloudState.timestamp || 0).getTime();
                const localModStr = localStorage.getItem(this.STORAGE_KEY_LAST_MODIFIED);
                const localModTime = localModStr ? new Date(localModStr).getTime() : 0;
                
                console.log(`Cloud: ${new Date(cloudTime).toLocaleString()}`);
                console.log(`Local: ${localModStr ? new Date(localModStr).toLocaleString() : 'never'}`);
                
                // Check if changed in last 60s
                const changedRecently = (Date.now() - localModTime) < 60000;
                
                if (cloudTime > localModTime) {
                    // Cloud is newer - PULL
                    console.log('📥 Cloud newer - pulling');
                    await this.pullFromCloud(cloudState);
                    this.syncStatus = 'success';
                    this.syncMessage = 'Pulled';
                    
                } else if (localModTime > cloudTime && changedRecently) {
                    // Local is newer and changed recently - PUSH
                    console.log('📤 Local newer - pushing');
                    state.timestamp = localModStr;
                    localStorage.setItem('gt50-tester-state', JSON.stringify(state));
                    await this.pushToCloud(token, gistId, state);
                    localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    this.syncStatus = 'success';
                    this.syncMessage = 'Pushed';
                    
                } else {
                    // In sync
                    this.syncStatus = 'success';
                    this.syncMessage = 'In sync';
                }
                
                this.isSyncing = false;
                
            } catch (error) {
                console.error('❌ Sync error:', error);
                this.syncStatus = 'error';
                this.syncMessage = 'Error: ' + error.message;
                this.isSyncing = false;
            }
        },
        
        // Manual pull
        manualPull: async function() {
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            
            if (!token || !gistId) {
                alert('No credentials');
                return;
            }
            
            try {
                this.isSyncing = true;
                this.syncStatus = 'syncing';
                
                const cloudState = await this.getCloudState(token, gistId);
                
                if (!cloudState) {
                    alert('No cloud data found');
                    this.isSyncing = false;
                    return;
                }
                
                await this.pullFromCloud(cloudState);
                this.syncStatus = 'success';
                this.syncMessage = 'Pulled';
                this.isSyncing = false;
                
            } catch (error) {
                alert('Pull failed: ' + error.message);
                this.syncStatus = 'error';
                this.isSyncing = false;
            }
        },
        
        // Test token
        testToken: async function(token) {
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github+json'
                    }
                });
                
                if (!response.ok) {
                    return { success: false, error: 'Invalid token' };
                }
                
                const user = await response.json();
                return { success: true, username: user.login };
                
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        
        // Create new gist
        createGist: async function(token) {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json'
                },
                body: JSON.stringify({
                    description: 'GT50 Cloud Sync',
                    public: false,
                    files: {
                        'gt50-state.json': {
                            content: JSON.stringify({
                                version: "1.0",
                                timestamp: new Date().toISOString(),
                                app: "GT50",
                                data: { tabs: [], tabComponents: [[]] }
                            }, null, 2)
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error('Failed to create gist');
            }
            
            const gist = await response.json();
            return gist.id;
        },
        
        // RENDER SETUP SCREEN
        renderSetup: function(container, state, onChange) {
            container.innerHTML = `
                <div style="padding: var(--margin); display: flex; flex-direction: column; gap: var(--margin);">
                    <div style="font-size: 13px; color: var(--color-10); line-height: 1.5;">
                        <strong>GitHub Cloud Sync Setup</strong><br/>
                        Store your GT50 data in a private GitHub Gist for automatic sync across devices.
                    </div>
                    
                    <div style="background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: 8px; padding: 12px;">
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.6; margin-bottom: 4px;">GITHUB TOKEN</div>
                        <input type="password" id="token-input" placeholder="ghp_xxxxxxxxxxxx" style="width: 100%; height: 35px; background: var(--bg-2); border: var(--border-width) solid var(--border-color); border-radius: 4px; color: var(--color-10); padding: 0 8px; font-size: 12px; font-family: 'Courier New', monospace;" />
                    </div>
                    
                    <div style="background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: 8px; padding: 12px;">
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.6; margin-bottom: 4px;">GIST ID (optional - leave empty to create new)</div>
                        <input type="text" id="gist-input" placeholder="abc123def456..." style="width: 100%; height: 35px; background: var(--bg-2); border: var(--border-width) solid var(--border-color); border-radius: 4px; color: var(--color-10); padding: 0 8px; font-size: 12px; font-family: 'Courier New', monospace;" />
                    </div>
                    
                    <div id="status-msg" style="display: none; padding: 8px; border-radius: 4px; font-size: 12px;"></div>
                    
                    <button id="enable-btn" style="width: 100%; height: 45px; background: var(--bg-3); border: var(--border-width) solid var(--color-6); border-radius: 8px; color: var(--color-6); font-weight: 600; cursor: pointer;">
                        ENABLE CLOUD SYNC
                    </button>
                </div>
            `;
            
            const tokenInput = container.querySelector('#token-input');
            const gistInput = container.querySelector('#gist-input');
            const statusMsg = container.querySelector('#status-msg');
            const enableBtn = container.querySelector('#enable-btn');
            
            enableBtn.onclick = async () => {
                const token = tokenInput.value.trim();
                const gistId = gistInput.value.trim();
                
                if (!token) {
                    statusMsg.style.display = 'block';
                    statusMsg.style.background = '#ef4444';
                    statusMsg.style.color = 'white';
                    statusMsg.textContent = 'Please enter a GitHub token';
                    return;
                }
                
                enableBtn.disabled = true;
                enableBtn.textContent = 'TESTING...';
                
                // Test token
                const testResult = await this.testToken(token);
                if (!testResult.success) {
                    statusMsg.style.display = 'block';
                    statusMsg.style.background = '#ef4444';
                    statusMsg.style.color = 'white';
                    statusMsg.textContent = 'Token test failed: ' + testResult.error;
                    enableBtn.disabled = false;
                    enableBtn.textContent = 'ENABLE CLOUD SYNC';
                    return;
                }
                
                let finalGistId = gistId;
                
                // Create gist if needed
                if (!finalGistId) {
                    enableBtn.textContent = 'CREATING GIST...';
                    try {
                        finalGistId = await this.createGist(token);
                    } catch (error) {
                        statusMsg.style.display = 'block';
                        statusMsg.style.background = '#ef4444';
                        statusMsg.style.color = 'white';
                        statusMsg.textContent = 'Failed to create gist: ' + error.message;
                        enableBtn.disabled = false;
                        enableBtn.textContent = 'ENABLE CLOUD SYNC';
                        return;
                    }
                }
                
                // Save credentials
                this.saveCredentials(token, finalGistId);
                
                // Initialize lastModified if needed
                if (!localStorage.getItem(this.STORAGE_KEY_LAST_MODIFIED)) {
                    const stateStr = localStorage.getItem('gt50-tester-state');
                    if (stateStr) {
                        const state = JSON.parse(stateStr);
                        const timestamp = state.timestamp || new Date().toISOString();
                        localStorage.setItem(this.STORAGE_KEY_LAST_MODIFIED, timestamp);
                    }
                }
                
                // Enable with push disabled by default
                this.setCanPush(false);
                state.enabled = true;
                this.setEnabled(true);
                
                onChange();
            };
        },
        
        // RENDER ACTIVE SCREEN
        renderActive: function(container, state, onChange) {
            const canPush = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            
            // Calculate last sync time
            const lastSyncStr = localStorage.getItem(this.STORAGE_KEY_LAST_SYNC);
            let timeAgo = 'Never';
            if (lastSyncStr) {
                const seconds = Math.floor((Date.now() - new Date(lastSyncStr).getTime()) / 1000);
                if (seconds < 60) timeAgo = `${seconds}s ago`;
                else if (seconds < 3600) timeAgo = `${Math.floor(seconds/60)}m ago`;
                else timeAgo = `${Math.floor(seconds/3600)}h ago`;
            }
            
            const statusColor = this.syncStatus === 'syncing' ? '#facc15' : 
                              this.syncStatus === 'error' ? '#ef4444' : '#22c55e';
            
            container.innerHTML = `
                <div style="padding: var(--margin); display: flex; flex-direction: column; gap: var(--margin);">
                    <!-- Status -->
                    <div style="background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: 8px; padding: 12px;">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <div style="width: 12px; height: 12px; border-radius: 50%; background: ${statusColor};"></div>
                            <div style="font-weight: 600; color: var(--color-10);">Cloud Sync Active</div>
                        </div>
                        <div style="font-size: 12px; color: var(--color-10); opacity: 0.8;">
                            Last sync: ${timeAgo}<br/>
                            Next sync: <span id="countdown">${this.secondsUntilSync}s</span><br/>
                            Status: ${this.syncMessage || 'Ready'}
                        </div>
                    </div>
                    
                    <!-- Mode -->
                    <div style="background: ${canPush ? 'var(--bg-3)' : '#7f1d1d'}; border: var(--border-width) solid ${canPush ? 'var(--border-color)' : '#ef4444'}; border-radius: 8px; padding: 12px;">
                        <div style="font-weight: 600; color: ${canPush ? 'var(--color-10)' : '#ef4444'}; margin-bottom: 4px;">
                            ${canPush ? '🔄 TWO-WAY SYNC' : '📥 PULL-ONLY MODE'}
                        </div>
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.8;">
                            ${canPush ? 'Can push and pull' : 'Can only pull from cloud'}
                        </div>
                    </div>
                    
                    <!-- Gist Info -->
                    <div style="background: var(--bg-3); border: var(--border-width) solid var(--border-color); border-radius: 8px; padding: 12px;">
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.6; margin-bottom: 4px;">GIST ID</div>
                        <div style="font-size: 11px; color: var(--color-10); font-family: 'Courier New', monospace; word-break: break-all;">${gistId}</div>
                    </div>
                    
                    <!-- Actions -->
                    <div style="display: flex; gap: var(--margin);">
                        <button id="pull-btn" style="flex: 1; height: 45px; background: var(--bg-3); border: var(--border-width) solid var(--color-6); border-radius: 8px; color: var(--color-6); font-weight: 600; cursor: pointer;">PULL NOW</button>
                        <button id="sync-btn" style="flex: 1; height: 45px; background: var(--bg-3); border: var(--border-width) solid var(--color-6); border-radius: 8px; color: var(--color-6); font-weight: 600; cursor: pointer;">SYNC NOW</button>
                    </div>
                    
                    <button id="toggle-push-btn" style="width: 100%; height: 45px; background: var(--bg-3); border: var(--border-width) solid ${canPush ? '#ef4444' : '#22c55e'}; border-radius: 8px; color: ${canPush ? '#ef4444' : '#22c55e'}; font-weight: 600; cursor: pointer;">
                        ${canPush ? '🔒 DISABLE PUSH' : '🔓 ENABLE PUSH'}
                    </button>
                    
                    <button id="disable-btn" style="width: 100%; height: 45px; background: var(--bg-3); border: var(--border-width) solid #ef4444; border-radius: 8px; color: #ef4444; font-weight: 600; cursor: pointer;">DISABLE CLOUD SYNC</button>
                </div>
            `;
            
            const pullBtn = container.querySelector('#pull-btn');
            const syncBtn = container.querySelector('#sync-btn');
            const togglePushBtn = container.querySelector('#toggle-push-btn');
            const disableBtn = container.querySelector('#disable-btn');
            const countdown = container.querySelector('#countdown');
            
            // Update countdown display
            const updateCountdown = setInterval(() => {
                if (countdown && countdown.isConnected) {
                    countdown.textContent = `${this.secondsUntilSync}s`;
                } else {
                    clearInterval(updateCountdown);
                }
            }, 100);
            
            pullBtn.onclick = async () => {
                pullBtn.disabled = true;
                pullBtn.textContent = 'PULLING...';
                await this.manualPull();
                pullBtn.disabled = false;
                pullBtn.textContent = 'PULL NOW';
                onChange();
            };
            
            syncBtn.onclick = async () => {
                syncBtn.disabled = true;
                syncBtn.textContent = 'SYNCING...';
                await this.smartSync();
                this.secondsUntilSync = 60;
                syncBtn.disabled = false;
                syncBtn.textContent = 'SYNC NOW';
                onChange();
            };
            
            togglePushBtn.onclick = () => {
                const current = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
                if (!current) {
                    if (confirm('Enable push? This device can overwrite cloud data.')) {
                        this.setCanPush(true);
                        onChange();
                    }
                } else {
                    this.setCanPush(false);
                    onChange();
                }
            };
            
            disableBtn.onclick = () => {
                if (confirm('Disable cloud sync?')) {
                    state.enabled = false;
                    this.setEnabled(false);
                    onChange();
                }
            };
        },
        
        // Main render
        render: function(container, state, onChange) {
            const enabled = localStorage.getItem(this.STORAGE_KEY_ENABLED) === 'true';
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            
            if (enabled && token && gistId) {
                this.renderActive(container, state, onChange);
            } else {
                this.renderSetup(container, state, onChange);
            }
        }
    };
    
    // Auto-start on page load
    window.addEventListener('DOMContentLoaded', () => {
        const enabled = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_ENABLED) === 'true';
        const token = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_TOKEN);
        const gistId = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_GIST_ID);
        
        if (enabled && token && gistId) {
            console.log('🚀 Auto-starting cloud sync');
            GT50Lib.CloudSync.startAutoSync();
        }
    });
    
    console.log('✓ CloudSync loaded');
})();
