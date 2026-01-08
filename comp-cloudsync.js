(function() {
    // Static injector ID
    const INJECTOR_ID = '0020';
    
    // ===== CLOUD SYNC COMPONENT =====
    window.GT50Lib = window.GT50Lib || {};
    
    window.GT50Lib.CloudSync = {
        // ===== STORAGE KEYS =====
        STORAGE_KEY_TOKEN: 'gt50-github-token',
        STORAGE_KEY_GIST_ID: 'gt50-gist-id',
        STORAGE_KEY_LAST_SYNC: 'gt50-last-sync-time',
        STORAGE_KEY_ENABLED: 'gt50-sync-enabled',
        STORAGE_KEY_CAN_PUSH: 'gt50-can-push',
        STORAGE_KEY_LAST_PULL: 'gt50-last-pull-time',
        STORAGE_KEY_LAST_SYNCED_HASH: 'gt50-last-synced-hash',
        
        // ===== SYNC STATE =====
        syncInterval: null,
        isSyncing: false,
        lastSyncedState: null,
        syncStatus: 'idle', // idle, syncing, success, error
        syncMessage: '',
        autoSyncEnabled: false,
        appState: null, // Store reference to app state
        lastPullTime: 0, // Track when we last pulled to prevent immediate re-pulls
        
        // ===== STATE FACTORY =====
        // NOTE: token and gistId are NOT stored in state, only in localStorage
        // This prevents them from being synced to cloud where GitHub would detect and revoke them
        defaultState: function() {
            return {
                enabled: localStorage.getItem(this.STORAGE_KEY_ENABLED) === 'true',
                canPush: localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true',
                lastSync: localStorage.getItem(this.STORAGE_KEY_LAST_SYNC) || null
            };
        },
        
        // ===== SAVE CREDENTIALS =====
        saveCredentials: function(token, gistId) {
            localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
            localStorage.setItem(this.STORAGE_KEY_GIST_ID, gistId);
        },
        
        // ===== SIMPLE HASH FOR CHANGE DETECTION =====
        simpleHash: function(str) {
            let hash = 0;
            for (let i = 0; i < str.length; i++) {
                const char = str.charCodeAt(i);
                hash = ((hash << 5) - hash) + char;
                hash = hash & hash;
            }
            return hash.toString();
        },
        
        // ===== CHECK IF LOCAL STATE HAS CHANGED =====
        hasLocalChanges: function(currentState) {
            const currentHash = this.simpleHash(JSON.stringify(currentState));
            const lastSyncedHash = localStorage.getItem(this.STORAGE_KEY_LAST_SYNCED_HASH);
            return !lastSyncedHash || currentHash !== lastSyncedHash;
        },
        
        // ===== MARK STATE AS SYNCED =====
        markAsSynced: function(state) {
            const hash = this.simpleHash(JSON.stringify(state));
            localStorage.setItem(this.STORAGE_KEY_LAST_SYNCED_HASH, hash);
        },
        
        // ===== ENABLE/DISABLE PUSH =====
        setCanPush: function(canPush) {
            localStorage.setItem(this.STORAGE_KEY_CAN_PUSH, canPush ? 'true' : 'false');
            console.log(canPush ? '✅ Push enabled' : '🔒 Push disabled (pull-only mode)');
        },
        
        // ===== ENABLE/DISABLE AUTO-SYNC =====
        setEnabled: function(enabled) {
            localStorage.setItem(this.STORAGE_KEY_ENABLED, enabled ? 'true' : 'false');
            this.autoSyncEnabled = enabled;
            
            if (enabled) {
                this.startAutoSync();
            } else {
                this.stopAutoSync();
            }
        },
        
        // ===== START AUTO-SYNC =====
        startAutoSync: function() {
            if (this.syncInterval) return; // Already running
            
            console.log('🔄 Starting auto-sync (every 60 seconds)');
            
            // Run immediately on start
            this.smartSync();
            
            // Then every 60 seconds
            this.syncInterval = setInterval(() => {
                this.smartSync();
            }, 60000);
        },
        
        // ===== STOP AUTO-SYNC =====
        stopAutoSync: function() {
            if (this.syncInterval) {
                clearInterval(this.syncInterval);
                this.syncInterval = null;
                console.log('⏸️ Stopped auto-sync');
            }
        },
        
        // ===== MANUAL PULL =====
        manualPull: async function() {
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            
            if (!token || !gistId) {
                alert('No credentials configured');
                return;
            }
            
            try {
                this.isSyncing = true;
                this.syncStatus = 'syncing';
                
                const cloudState = await this.getCloudState(token, gistId);
                
                if (cloudState && cloudState.error) {
                    alert(`Error: ${cloudState.message}`);
                    this.syncStatus = 'error';
                    this.syncMessage = cloudState.message;
                    this.isSyncing = false;
                    return;
                }
                
                if (!cloudState) {
                    alert('No cloud data found');
                    this.syncStatus = 'idle';
                    this.isSyncing = false;
                    return;
                }
                
                console.log('📥 Manual pull from cloud...');
                const pullTime = Date.now();
                this.lastPullTime = pullTime; // Set cooldown
                localStorage.setItem(this.STORAGE_KEY_LAST_PULL, pullTime.toString());
                await this.pullFromCloud(cloudState);
                
            } catch (error) {
                alert(`Pull failed: ${error.message}`);
                this.syncStatus = 'error';
                this.syncMessage = error.message;
                this.isSyncing = false;
            }
        },
        
        // ===== SMART SYNC (TIMESTAMP-BASED) =====
        smartSync: async function() {
            if (this.isSyncing) return; // Prevent concurrent syncs
            
            // Check cooldown - don't sync within 10 seconds of last pull
            const lastPullStr = localStorage.getItem(this.STORAGE_KEY_LAST_PULL);
            const lastPullTime = lastPullStr ? parseInt(lastPullStr) : 0;
            const timeSinceLastPull = Date.now() - lastPullTime;
            
            if (timeSinceLastPull < 10000) {
                console.log(`⏳ Cooldown active (${Math.floor(timeSinceLastPull/1000)}s since last pull)`);
                return;
            }
            
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            const canPush = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
            
            if (!token || !gistId) {
                console.log('⚠️ Sync skipped: No credentials configured');
                return;
            }
            
            try {
                this.isSyncing = true;
                this.syncStatus = 'syncing';
                
                // Get local state
                const localStateStr = localStorage.getItem('gt50-tester-state');
                if (!localStateStr) {
                    console.log('⚠️ No local state to sync');
                    this.isSyncing = false;
                    return;
                }
                
                const localState = JSON.parse(localStateStr);
                
                // Get cloud state
                const cloudState = await this.getCloudState(token, gistId);
                
                // Handle errors from getCloudState
                if (cloudState && cloudState.error) {
                    this.syncStatus = 'error';
                    if (cloudState.error === 404) {
                        this.syncMessage = 'Gist not found';
                    } else {
                        this.syncMessage = `Error ${cloudState.error}`;
                    }
                    this.isSyncing = false;
                    return;
                }
                
                // No cloud state yet
                if (!cloudState) {
                    if (canPush) {
                        console.log('📤 No cloud state found, pushing local...');
                        await this.pushToCloud(token, gistId, localState);
                        this.markAsSynced(localState);
                        this.syncStatus = 'success';
                        this.syncMessage = 'Initial push complete';
                        localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    } else {
                        console.log('⚠️ No cloud state, but pushing disabled');
                        this.syncStatus = 'idle';
                        this.syncMessage = 'Waiting for cloud data (push disabled)';
                    }
                    this.isSyncing = false;
                    return;
                }
                
                // PULL-ONLY MODE
                if (!canPush) {
                    // Extract timestamps
                    const localData = this.extractDataOnly(localState);
                    const localTime = new Date(localData.timestamp || 0).getTime();
                    const cloudTime = new Date(cloudState.timestamp || 0).getTime();
                    
                    if (cloudTime > localTime) {
                        console.log('📥 Pull-only: Cloud is newer - pulling...');
                        const pullTime = Date.now();
                        localStorage.setItem(this.STORAGE_KEY_LAST_PULL, pullTime.toString());
                        await this.pullFromCloud(cloudState);
                        return;
                    } else {
                        console.log('✓ Pull-only: Local is up to date');
                        this.syncStatus = 'success';
                        this.syncMessage = 'In sync';
                        this.isSyncing = false;
                        return;
                    }
                }
                
                // NORMAL SYNC MODE - Compare timestamps only
                const localData = this.extractDataOnly(localState);
                const localTime = new Date(localData.timestamp || 0).getTime();
                const cloudTime = new Date(cloudState.timestamp || 0).getTime();
                
                console.log(`⏰ Local: ${new Date(localTime).toLocaleString()}`);
                console.log(`⏰ Cloud: ${new Date(cloudTime).toLocaleString()}`);
                
                if (cloudTime > localTime) {
                    // Cloud is newer - pull and overwrite
                    console.log('📥 Cloud is newer - pulling and overwriting local...');
                    const pullTime = Date.now();
                    localStorage.setItem(this.STORAGE_KEY_LAST_PULL, pullTime.toString());
                    await this.pullFromCloud(cloudState);
                    return;
                } else if (localTime > cloudTime) {
                    // Local is newer - check if there are actual changes
                    const hasChanges = this.hasLocalChanges(localState);
                    
                    if (hasChanges) {
                        console.log('📤 Local has changes - pushing to cloud...');
                        await this.pushToCloud(token, gistId, localState);
                        this.markAsSynced(localState);
                        this.syncStatus = 'success';
                        this.syncMessage = 'Pushed to cloud';
                        localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    } else {
                        console.log('✓ No changes detected - already synced');
                        this.syncStatus = 'success';
                        this.syncMessage = 'In sync';
                    }
                } else {
                    // Timestamps are equal
                    console.log('✓ Timestamps match - in sync');
                    this.syncStatus = 'success';
                    this.syncMessage = 'In sync';
                }
                
                this.isSyncing = false;
                
            } catch (error) {
                console.error('❌ Sync error:', error);
                this.syncStatus = 'error';
                this.syncMessage = error.message || 'Sync failed';
                this.isSyncing = false;
            }
        },
        
        // ===== TEST TOKEN =====
        testToken: async function(token) {
            try {
                const response = await fetch('https://api.github.com/user', {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github+json'
                    }
                });
                
                if (!response.ok) {
                    return { success: false, error: `Token invalid (${response.status})` };
                }
                
                const user = await response.json();
                return { success: true, username: user.login };
            } catch (error) {
                return { success: false, error: error.message };
            }
        },
        
        // ===== GET CLOUD STATE =====
        getCloudState: async function(token, gistId) {
            try {
                const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Accept': 'application/vnd.github+json',
                        'X-GitHub-Api-Version': '2022-11-28'
                    }
                });
                
                if (response.status === 404) {
                    return { error: 404, message: 'Gist not found. Create a new one by leaving Gist ID empty.' };
                }
                
                if (!response.ok) {
                    const errorBody = await response.text();
                    return { error: response.status, message: errorBody };
                }
                
                const gist = await response.json();
                
                if (!gist.files['gt50-state.json']) {
                    return null; // No state file yet
                }
                
                const content = gist.files['gt50-state.json'].content;
                return JSON.parse(content);
            } catch (error) {
                return { error: 'network', message: error.message };
            }
        },
        
        // ===== EXTRACT DATA ONLY (NO UI STATE) =====
        extractDataOnly: function(state) {
            // Use exact import-compatible format
            return {
                version: "1.0",
                timestamp: state.timestamp || new Date().toISOString(),
                app: "GT50 Tester",
                data: {
                    tabs: state.tabs,
                    tabComponents: state.tabComponents
                }
            };
        },
        
        // ===== PUSH TO CLOUD =====
        pushToCloud: async function(token, gistId, state) {
            // Extract only the data (no UI state)
            const dataOnly = this.extractDataOnly(state);
            
            const response = await fetch(`https://api.github.com/gists/${gistId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify({
                    files: {
                        'gt50-state.json': {
                            content: JSON.stringify(dataOnly, null, 2)
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to push: ${response.status}`);
            }
        },
        
        // ===== PULL FROM CLOUD =====
        pullFromCloud: async function(cloudData) {
            // Stop auto-sync
            this.stopAutoSync();
            
            // Convert to text like import button expects
            const text = JSON.stringify(cloudData);
            
            // Use EXACT import button code
            const result = GT50Lib.ImpEx.importData(text);
            
            if (result.success) {
                if (!this.appState) {
                    alert('ERROR: Cannot access app state');
                    this.isSyncing = false;
                    return;
                }
                
                // EXACT COPY from import button - lines 691-717
                // Update app state
                this.appState.tabs = result.data.tabs;
                this.appState.tabComponents = result.data.tabComponents;
                
                // Update global state
                if (typeof window !== 'undefined') {
                    window.nextId = Date.now();
                    window.navigationStack = [];
                    window.scrollStack = [];
                }
                
                // Reset header
                if (!this.appState.header) {
                    this.appState.header = GT50Lib.Header.defaultState();
                }
                this.appState.header.isMain = true;
                this.appState.header.title = 'GT50 TESTER';
                
                // Set timestamp to match cloud (CRITICAL for next sync)
                this.appState.timestamp = cloudData.timestamp;
                
                // Close window
                this.appState.impex.isOpen = false;
                
                // Render and save
                if (typeof window !== 'undefined' && window.render) {
                    window.render(true);
                }
                if (typeof window !== 'undefined' && window.saveState) {
                    window.saveState();
                }
                
                // Mark as synced with pulled state
                this.markAsSynced(this.appState);
                
                this.syncStatus = 'success';
                this.syncMessage = 'Pulled from cloud';
                this.isSyncing = false;
                
                // Restart auto-sync
                setTimeout(() => {
                    if (this.autoSyncEnabled) {
                        this.startAutoSync();
                    }
                }, 2000);
                
            } else {
                alert(`Pull failed: ${result.error}`);
                this.syncStatus = 'error';
                this.syncMessage = result.error;
                this.isSyncing = false;
            }
        },
        
        // ===== CREATE NEW GIST =====
        createGist: async function(token) {
            const response = await fetch('https://api.github.com/gists', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                    'Accept': 'application/vnd.github+json',
                    'X-GitHub-Api-Version': '2022-11-28'
                },
                body: JSON.stringify({
                    description: 'GT50 Cloud Sync Data',
                    public: false,
                    files: {
                        'gt50-state.json': {
                            content: '{"timestamp":"' + new Date().toISOString() + '"}'
                        }
                    }
                })
            });
            
            if (!response.ok) {
                throw new Error(`Failed to create gist: ${response.status}`);
            }
            
            const gist = await response.json();
            return gist.id;
        },
        
        // ===== RENDER SETUP SCREEN =====
        renderSetup: function(container, state, onChange) {
            container.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: var(--margin);
                    padding: var(--margin);
                ">
                    <div style="
                        font-size: 18px;
                        font-weight: 600;
                        color: var(--color-10);
                        text-align: center;
                    ">CLOUD SYNC SETUP</div>
                    
                    <div style="
                        font-size: 12px;
                        color: var(--color-10);
                        opacity: 0.8;
                        line-height: 1.5;
                    ">
                        Sync your GT50 data across devices using GitHub Gist.<br/><br/>
                        1. Create a GitHub Personal Access Token with 'gist' scope<br/>
                        2. Optionally provide an existing Gist ID (or leave empty to create new)
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size: 11px; color: var(--color-10); opacity: 0.6;">
                            GITHUB TOKEN
                        </label>
                        <input id="token-input" type="password" style="
                            width: 100%;
                            height: var(--card-height);
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            padding: 0 12px;
                            color: var(--color-10);
                            font-family: 'Courier New', monospace;
                            font-size: 12px;
                        " placeholder="ghp_xxxxxxxxxxxx"/>
                    </div>
                    
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size: 11px; color: var(--color-10); opacity: 0.6;">
                            GIST ID (optional - leave empty to create new)
                        </label>
                        <input id="gist-input" type="text" style="
                            width: 100%;
                            height: var(--card-height);
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            padding: 0 12px;
                            color: var(--color-10);
                            font-family: 'Courier New', monospace;
                            font-size: 12px;
                        " placeholder="Leave empty to create new gist"/>
                    </div>
                    
                    <div id="error-msg" style="
                        display: none;
                        padding: 12px;
                        background: var(--error-bg);
                        border: var(--border-width) solid var(--error-border);
                        border-radius: 8px;
                        color: var(--error-color);
                        font-size: 12px;
                    "></div>
                    
                    <!-- Cleanup Button -->
                    <button id="cleanup-btn" style="
                        height: var(--card-height);
                        background: #ef4444;
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">🧹 CLEAN OLD DATA FIRST</button>
                    
                    <div id="cleanup-status" style="
                        display: none;
                        padding: 12px;
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        color: var(--color-10);
                        font-size: 12px;
                    "></div>
                    
                    <button id="enable-btn" style="
                        height: var(--card-height);
                        background: var(--accent);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">ENABLE CLOUD SYNC</button>
                </div>
            `;
            
            const tokenInput = container.querySelector('#token-input');
            const gistInput = container.querySelector('#gist-input');
            const enableBtn = container.querySelector('#enable-btn');
            const cleanupBtn = container.querySelector('#cleanup-btn');
            const cleanupStatus = container.querySelector('#cleanup-status');
            const errorMsg = container.querySelector('#error-msg');
            
            // Cleanup button - removes old sync data from localStorage
            cleanupBtn.onclick = () => {
                cleanupBtn.disabled = true;
                cleanupBtn.textContent = 'CLEANING...';
                
                try {
                    const stateStr = localStorage.getItem('gt50-tester-state');
                    if (stateStr) {
                        const appState = JSON.parse(stateStr);
                        let cleaned = false;
                        
                        // Remove old cloud sync data from state
                        if (appState.impex && appState.impex.cloudSync) {
                            if (appState.impex.cloudSync.token) {
                                delete appState.impex.cloudSync.token;
                                cleaned = true;
                            }
                            if (appState.impex.cloudSync.gistId) {
                                delete appState.impex.cloudSync.gistId;
                                cleaned = true;
                            }
                        }
                        
                        if (cleaned) {
                            localStorage.setItem('gt50-tester-state', JSON.stringify(appState));
                            cleanupStatus.style.display = 'block';
                            cleanupStatus.style.background = '#22c55e';
                            cleanupStatus.textContent = '✓ Cleaned! Old token/gist data removed from storage. You can now set up fresh.';
                        } else {
                            cleanupStatus.style.display = 'block';
                            cleanupStatus.textContent = '✓ No cleanup needed - storage is clean.';
                        }
                    } else {
                        cleanupStatus.style.display = 'block';
                        cleanupStatus.textContent = '✓ No cleanup needed - no stored data found.';
                    }
                    
                    cleanupBtn.disabled = false;
                    cleanupBtn.textContent = '🧹 CLEAN OLD DATA FIRST';
                } catch (error) {
                    cleanupStatus.style.display = 'block';
                    cleanupStatus.style.background = '#ef4444';
                    cleanupStatus.textContent = '✗ Error: ' + error.message;
                    cleanupBtn.disabled = false;
                    cleanupBtn.textContent = '🧹 CLEAN OLD DATA FIRST';
                }
            };
            
            cleanupBtn.onmouseover = () => cleanupBtn.style.filter = 'brightness(1.1)';
            cleanupBtn.onmouseout = () => cleanupBtn.style.filter = 'brightness(1)';
            
            enableBtn.onclick = async () => {
                const token = tokenInput.value.trim();
                if (!token) {
                    errorMsg.textContent = 'Please enter a GitHub token';
                    errorMsg.style.display = 'block';
                    return;
                }
                
                enableBtn.disabled = true;
                enableBtn.textContent = 'TESTING TOKEN...';
                
                const tokenTest = await this.testToken(token);
                if (!tokenTest.success) {
                    errorMsg.textContent = tokenTest.error;
                    errorMsg.style.display = 'block';
                    enableBtn.disabled = false;
                    enableBtn.textContent = 'ENABLE CLOUD SYNC';
                    return;
                }
                
                let gistId = gistInput.value.trim();
                
                if (!gistId) {
                    enableBtn.textContent = 'CREATING GIST...';
                    try {
                        gistId = await this.createGist(token);
                        console.log('✓ Created new gist:', gistId);
                    } catch (error) {
                        errorMsg.textContent = `Failed to create gist: ${error.message}`;
                        errorMsg.style.display = 'block';
                        enableBtn.disabled = false;
                        enableBtn.textContent = 'ENABLE CLOUD SYNC';
                        return;
                    }
                }
                
                this.saveCredentials(token, gistId);
                this.setCanPush(false); // Start in pull-only mode
                this.setEnabled(true);
                state.enabled = true;
                
                onChange();
            };
            
            enableBtn.onmouseover = () => enableBtn.style.filter = 'brightness(1.1)';
            enableBtn.onmouseout = () => enableBtn.style.filter = 'brightness(1)';
        },
        
        // ===== RENDER ACTIVE SCREEN =====
        renderActive: function(container, state, onChange) {
            const savedGistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            const canPush = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
            const lastSync = localStorage.getItem(this.STORAGE_KEY_LAST_SYNC);
            
            let statusColor = '#666';
            if (this.syncStatus === 'success') statusColor = '#22c55e';
            else if (this.syncStatus === 'error') statusColor = '#ef4444';
            else if (this.syncStatus === 'syncing') statusColor = '#3b82f6';
            
            let timeAgoStr = 'Never';
            if (lastSync) {
                const diff = Date.now() - new Date(lastSync);
                const seconds = Math.floor(diff / 1000);
                const minutes = Math.floor(seconds / 60);
                const hours = Math.floor(minutes / 60);
                
                if (hours > 0) timeAgoStr = `${hours}h ago`;
                else if (minutes > 0) timeAgoStr = `${minutes}m ago`;
                else timeAgoStr = `${seconds}s ago`;
            }
            
            container.innerHTML = `
                <div style="
                    display: flex;
                    flex-direction: column;
                    gap: var(--margin);
                    padding: var(--margin);
                ">
                    <!-- Status -->
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="display: flex; align-items: center; gap: 8px; margin-bottom: 8px;">
                            <div style="
                                width: 12px;
                                height: 12px;
                                border-radius: 50%;
                                background: ${statusColor};
                                animation: ${this.syncStatus === 'syncing' ? 'pulse 2s infinite' : 'none'};
                            "></div>
                            <div style="font-weight: 600; color: var(--color-10);">
                                ${this.syncStatus === 'syncing' ? 'Syncing...' : 'Cloud Sync Active'}
                            </div>
                        </div>
                        <div style="font-size: 12px; color: var(--color-10); opacity: 0.8;">
                            Last sync: ${timeAgoStr}<br/>
                            ${this.syncMessage ? `Status: ${this.syncMessage}` : ''}
                        </div>
                    </div>
                    
                    <!-- Mode Display -->
                    <div style="
                        background: ${canPush ? 'var(--bg-3)' : 'var(--error-bg)'};
                        border: var(--border-width) solid ${canPush ? 'var(--border-color)' : 'var(--error-border)'};
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="font-weight: 600; color: ${canPush ? 'var(--color-10)' : 'var(--error-color)'}; margin-bottom: 4px;">
                            ${canPush ? '🔄 TWO-WAY SYNC' : '📥 PULL-ONLY MODE'}
                        </div>
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.8;">
                            ${canPush ? 'This device can push and pull' : 'This device only pulls from cloud'}
                        </div>
                    </div>
                    
                    <!-- Gist Info -->
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.6; margin-bottom: 4px;">
                            GIST ID
                        </div>
                        <div style="
                            font-size: 11px; 
                            color: var(--color-10); 
                            font-family: 'Courier New', monospace;
                            word-break: break-all;
                        ">${savedGistId}</div>
                    </div>
                    
                    <!-- Manual Actions -->
                    <div style="display: flex; gap: var(--margin);">
                        <button id="manual-pull-btn" style="
                            flex: 1;
                            height: var(--card-height);
                            background: #3b82f6;
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            font-weight: 600;
                            color: var(--color-10);
                            font-size: 14px;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">PULL NOW</button>
                        
                        <button id="manual-sync-btn" style="
                            flex: 1;
                            height: var(--card-height);
                            background: var(--accent);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            font-weight: 600;
                            color: var(--color-10);
                            font-size: 14px;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">SYNC NOW</button>
                    </div>
                    
                    <!-- Push Toggle -->
                    <button id="toggle-push-btn" style="
                        width: 100%;
                        height: var(--card-height);
                        background: ${canPush ? '#22c55e' : '#ef4444'};
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        font-weight: 600;
                        color: var(--color-10);
                        font-size: 14px;
                        cursor: pointer;
                        transition: filter 0.2s;
                    ">${canPush ? '🔒 DISABLE PUSH' : '🔓 ENABLE PUSH'}</button>
                    
                    <!-- Danger Zone -->
                    <div style="
                        background: var(--error-bg);
                        border: var(--border-width) solid var(--error-border);
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="font-weight: 600; color: var(--error-color); margin-bottom: 8px;">
                            Danger Zone
                        </div>
                        <button id="disable-btn" style="
                            width: 100%;
                            height: var(--card-height);
                            background: var(--bg-3);
                            border: var(--border-width) solid var(--error-border);
                            border-radius: 8px;
                            font-weight: 600;
                            color: var(--error-color);
                            font-size: 12px;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">DISABLE CLOUD SYNC</button>
                    </div>
                    
                    <!-- Info -->
                    <div style="
                        font-size: 11px;
                        color: var(--color-10);
                        opacity: 0.6;
                        line-height: 1.5;
                    ">
                        Auto-sync runs every 60 seconds. Pull-only mode prevents this device from overwriting cloud data. Enable push once you've pulled the latest data.
                    </div>
                </div>
                
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                </style>
            `;
            
            const manualPullBtn = container.querySelector('#manual-pull-btn');
            const manualSyncBtn = container.querySelector('#manual-sync-btn');
            const togglePushBtn = container.querySelector('#toggle-push-btn');
            const disableBtn = container.querySelector('#disable-btn');
            
            manualPullBtn.onclick = async () => {
                manualPullBtn.disabled = true;
                manualPullBtn.textContent = 'PULLING...';
                
                await this.manualPull();
            };
            
            manualSyncBtn.onclick = async () => {
                manualSyncBtn.disabled = true;
                manualSyncBtn.textContent = 'SYNCING...';
                
                await this.smartSync();
                onChange();
                
                setTimeout(() => {
                    manualSyncBtn.disabled = false;
                    manualSyncBtn.textContent = 'SYNC NOW';
                }, 1000);
            };
            
            togglePushBtn.onclick = () => {
                const currentCanPush = localStorage.getItem(this.STORAGE_KEY_CAN_PUSH) === 'true';
                const newCanPush = !currentCanPush;
                
                if (newCanPush) {
                    if (confirm('Enable push? This device will be able to overwrite cloud data.')) {
                        this.setCanPush(true);
                        onChange();
                    }
                } else {
                    this.setCanPush(false);
                    onChange();
                }
            };
            
            disableBtn.onclick = () => {
                if (confirm('Disable cloud sync? Your local data will remain safe.')) {
                    state.enabled = false;
                    this.setEnabled(false);
                    onChange();
                }
            };
            
            manualPullBtn.onmouseover = () => manualPullBtn.style.filter = 'brightness(1.1)';
            manualPullBtn.onmouseout = () => manualPullBtn.style.filter = 'brightness(1)';
            manualSyncBtn.onmouseover = () => manualSyncBtn.style.filter = 'brightness(1.1)';
            manualSyncBtn.onmouseout = () => manualSyncBtn.style.filter = 'brightness(1)';
            togglePushBtn.onmouseover = () => togglePushBtn.style.filter = 'brightness(1.1)';
            togglePushBtn.onmouseout = () => togglePushBtn.style.filter = 'brightness(1)';
            disableBtn.onmouseover = () => disableBtn.style.filter = 'brightness(1.1)';
            disableBtn.onmouseout = () => disableBtn.style.filter = 'brightness(1)';
        },
        
        // ===== MAIN RENDER =====
        render: function(container, state, onChange, appState) {
            // Store app state reference
            this.appState = appState;
            
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
    
    // ===== AUTO-START SYNC IF ENABLED =====
    window.addEventListener('DOMContentLoaded', () => {
        const enabled = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_ENABLED) === 'true';
        const token = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_TOKEN);
        const gistId = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_GIST_ID);
        
        if (enabled && token && gistId) {
            console.log('🚀 Auto-starting cloud sync...');
            const canPush = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_CAN_PUSH) === 'true';
            console.log(`Mode: ${canPush ? 'TWO-WAY SYNC' : 'PULL-ONLY'}`);
            GT50Lib.CloudSync.autoSyncEnabled = true;
            GT50Lib.CloudSync.startAutoSync();
        }
    });
    
    console.log('✓ CloudSync component loaded');
})();
