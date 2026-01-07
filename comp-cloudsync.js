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
        
        // ===== SYNC STATE =====
        syncInterval: null,
        isSyncing: false,
        lastSyncedState: null,
        syncStatus: 'idle', // idle, syncing, success, error
        syncMessage: '',
        autoSyncEnabled: false,
        
        // ===== STATE FACTORY =====
        // NOTE: token and gistId are NOT stored in state, only in localStorage
        // This prevents them from being synced to cloud where GitHub would detect and revoke them
        defaultState: function() {
            return {
                enabled: localStorage.getItem(this.STORAGE_KEY_ENABLED) === 'true',
                lastSync: localStorage.getItem(this.STORAGE_KEY_LAST_SYNC) || null
            };
        },
        
        // ===== SAVE CREDENTIALS =====
        saveCredentials: function(token, gistId) {
            localStorage.setItem(this.STORAGE_KEY_TOKEN, token);
            localStorage.setItem(this.STORAGE_KEY_GIST_ID, gistId);
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
        
        // ===== SMART SYNC (TIMESTAMP-BASED) =====
        smartSync: async function() {
            if (this.isSyncing) return; // Prevent concurrent syncs
            
            const token = localStorage.getItem(this.STORAGE_KEY_TOKEN);
            const gistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID);
            
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
                
                // CRITICAL: Strip any token/gistId that might be in the state
                // This handles legacy states that have this data
                if (localState.impex && localState.impex.cloudSync) {
                    delete localState.impex.cloudSync.token;
                    delete localState.impex.cloudSync.gistId;
                }
                
                // Add timestamp if missing
                if (!localState.timestamp) {
                    localState.timestamp = new Date().toISOString();
                }
                
                // Save cleaned state back to localStorage
                localStorage.setItem('gt50-tester-state', JSON.stringify(localState));
                
                const localTime = new Date(localState.timestamp);
                
                // Get cloud state
                const cloudState = await this.getCloudState(token, gistId);
                
                // Handle errors from getCloudState
                if (cloudState && cloudState.error) {
                    this.syncStatus = 'error';
                    if (cloudState.error === 404) {
                        this.syncMessage = 'Gist not found. Disable sync and create new gist.';
                    } else {
                        this.syncMessage = `Error ${cloudState.error}: ${cloudState.message}`;
                    }
                    this.isSyncing = false;
                    console.error('Cloud state error:', cloudState);
                    return;
                }
                
                if (!cloudState) {
                    // No cloud state yet - push local
                    console.log('📤 No cloud state found, pushing local...');
                    await this.pushToCloud(token, gistId, localState);
                    this.syncStatus = 'success';
                    this.syncMessage = 'Initial sync complete';
                    localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    this.lastSyncedState = localStateStr;
                    this.isSyncing = false;
                    return;
                }
                
                const cloudTime = new Date(cloudState.timestamp || 0);
                const timeDiff = Math.abs(localTime - cloudTime);
                
                console.log(`⏰ Local: ${localTime.toISOString()}`);
                console.log(`⏰ Cloud: ${cloudTime.toISOString()}`);
                console.log(`⏰ Diff: ${timeDiff}ms`);
                
                if (timeDiff < 1000) {
                    // Already in sync (within 1 second)
                    console.log('✓ Already in sync');
                    this.syncStatus = 'success';
                    this.syncMessage = 'In sync';
                    this.lastSyncedState = localStateStr;
                } else if (localTime > cloudTime) {
                    // Local is newer - push
                    console.log('📤 Pushing to cloud (local newer)...');
                    await this.pushToCloud(token, gistId, localState);
                    this.syncStatus = 'success';
                    this.syncMessage = 'Pushed to cloud';
                    localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    this.lastSyncedState = localStateStr;
                } else {
                    // Cloud is newer - pull
                    console.log('📥 Pulling from cloud (cloud newer)...');
                    await this.pullFromCloud(cloudState);
                    this.syncStatus = 'success';
                    this.syncMessage = 'Pulled from cloud';
                    localStorage.setItem(this.STORAGE_KEY_LAST_SYNC, new Date().toISOString());
                    this.lastSyncedState = JSON.stringify(cloudState);
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
        
        // ===== CLEAN STATE FOR CLOUD (REMOVE SENSITIVE DATA) =====
        // CRITICAL: GitHub auto-scans gists for tokens and revokes them.
        // We must NEVER include token or gistId in the uploaded state.
        cleanStateForCloud: function(state) {
            const cleaned = JSON.parse(JSON.stringify(state));
            
            // Remove sensitive cloudSync data (multiple paths for safety)
            if (cleaned.impex) {
                if (cleaned.impex.cloudSync) {
                    delete cleaned.impex.cloudSync.token;
                    delete cleaned.impex.cloudSync.gistId;
                }
            }
            
            // Also check if somehow it's at root level
            if (cleaned.cloudSync) {
                delete cleaned.cloudSync.token;
                delete cleaned.cloudSync.gistId;
            }
            
            // Paranoid: recursively search for any 'token' or 'gistId' keys that look like credentials
            function stripSensitive(obj) {
                for (let key in obj) {
                    if (key === 'token' && typeof obj[key] === 'string' && obj[key].startsWith('ghp_')) {
                        console.warn('🔒 Found and removed token from state!');
                        delete obj[key];
                    } else if (key === 'gistId' && typeof obj[key] === 'string' && obj[key].length > 20) {
                        console.warn('🔒 Found and removed gistId from state!');
                        delete obj[key];
                    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
                        stripSensitive(obj[key]);
                    }
                }
            }
            
            stripSensitive(cleaned);
            
            return cleaned;
        },
        
        // ===== PUSH TO CLOUD =====
        pushToCloud: async function(token, gistId, state) {
            // CRITICAL: Clean sensitive data before uploading
            const cleanedState = this.cleanStateForCloud(state);
            
            // Update timestamp
            cleanedState.timestamp = new Date().toISOString();
            
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
                            content: JSON.stringify(cleanedState, null, 2)
                        }
                    }
                })
            });
            
            if (!response.ok) {
                const errorBody = await response.text();
                console.error('Push Error Response:', errorBody);
                throw new Error(`Push failed: ${response.status} - ${errorBody}`);
            }
            
            // Update original state's timestamp and save to localStorage
            state.timestamp = cleanedState.timestamp;
            localStorage.setItem('gt50-tester-state', JSON.stringify(state));
        },
        
        // ===== PULL FROM CLOUD =====
        pullFromCloud: async function(cloudState) {
            localStorage.setItem('gt50-tester-state', JSON.stringify(cloudState));
            
            // Show notification that we're reloading
            this.syncMessage = 'Reloading with cloud data...';
            
            // Reload page to reflect changes
            setTimeout(() => {
                window.location.reload();
            }, 500);
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
                const errorBody = await response.text();
                console.error('Create Gist Error:', errorBody);
                throw new Error(`Gist creation failed: ${response.status} - ${errorBody}`);
            }
            
            const gist = await response.json();
            return gist.id;
        },
        
        // ===== FORMAT TIME AGO =====
        timeAgo: function(timestamp) {
            if (!timestamp) return 'Never';
            
            const now = new Date();
            const then = new Date(timestamp);
            const seconds = Math.floor((now - then) / 1000);
            
            if (seconds < 60) return `${seconds}s ago`;
            if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
            if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
            return `${Math.floor(seconds / 86400)}d ago`;
        },
        
        // ===== RENDER SETUP SCREEN =====
        renderSetup: function(container, state, onChange) {
            // Always load from localStorage, not state (in case state got cleared)
            const savedToken = localStorage.getItem(this.STORAGE_KEY_TOKEN) || '';
            const savedGistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID) || '';
            
            container.innerHTML = `
                <div style="padding: var(--margin); display: flex; flex-direction: column; gap: var(--margin);">
                    
                    <!-- Info Card -->
                    <div style="
                        background: var(--bg-4);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 16px;
                    ">
                        <div style="font-weight: 600; color: var(--color-10); margin-bottom: 8px;">
                            🔐 GitHub Authentication
                        </div>
                        <div style="font-size: 12px; color: var(--color-10); opacity: 0.8; line-height: 1.5;">
                            Cloud sync uses GitHub Gists to store your GT50 data securely. You'll need a Personal Access Token with 'gist' permissions.
                        </div>
                    </div>
                    
                    <!-- Token Input -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size: 12px; font-weight: 600; color: var(--color-10);">
                            GitHub Personal Access Token
                        </label>
                        <input 
                            type="password" 
                            id="token-input"
                            placeholder="ghp_xxxxxxxxxxxxxxxxxxxx"
                            value="${savedToken}"
                            style="
                                height: var(--card-height);
                                background: var(--bg-3);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                color: var(--color-10);
                                padding: 0 12px;
                                font-size: 12px;
                                font-family: 'Courier New', monospace;
                            "
                        />
                    </div>
                    
                    <!-- Gist ID Input (optional) -->
                    <div style="display: flex; flex-direction: column; gap: 8px;">
                        <label style="font-size: 12px; font-weight: 600; color: var(--color-10);">
                            Gist ID (optional - leave empty to create new)
                        </label>
                        <input 
                            type="text" 
                            id="gist-input"
                            placeholder="Leave empty to create new gist"
                            value="${savedGistId}"
                            style="
                                height: var(--card-height);
                                background: var(--bg-3);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                color: var(--color-10);
                                padding: 0 12px;
                                font-size: 12px;
                                font-family: 'Courier New', monospace;
                            "
                        />
                    </div>
                    
                    <!-- Action Buttons -->
                    <div style="display: flex; flex-direction: column; gap: var(--margin);">
                        <button id="cleanup-btn" style="
                            width: 100%;
                            height: var(--card-height);
                            background: var(--color-2);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            font-weight: 600;
                            color: var(--color-10);
                            font-size: 14px;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">🧹 CLEAN OLD DATA FIRST</button>
                        
                        <button id="setup-btn" style="
                            width: 100%;
                            height: var(--card-height);
                            background: var(--accent);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            font-weight: 600;
                            color: var(--color-10);
                            font-size: 14px;
                            cursor: pointer;
                            transition: filter 0.2s;
                        ">ENABLE SYNC</button>
                    </div>
                    
                    <!-- Instructions -->
                    <div style="
                        background: var(--bg-3);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 12px;
                    ">
                        <div style="font-size: 11px; color: var(--color-10); opacity: 0.8; line-height: 1.6;">
                            <strong>How to get a token:</strong><br/>
                            1. Go to github.com/settings/tokens<br/>
                            2. Click "Generate new token (classic)"<br/>
                            3. Check the "gist" permission<br/>
                            4. Generate and copy the token<br/>
                            5. Paste it above and click Enable Sync<br/><br/>
                            <strong>⚠️ New token? Leave Gist ID empty!</strong><br/>
                            Tokens can only access gists they created.
                        </div>
                    </div>
                    
                    <div id="setup-status"></div>
                </div>
            `;
            
            const tokenInput = container.querySelector('#token-input');
            const gistInput = container.querySelector('#gist-input');
            const cleanupBtn = container.querySelector('#cleanup-btn');
            const setupBtn = container.querySelector('#setup-btn');
            const statusDiv = container.querySelector('#setup-status');
            
            tokenInput.oninput = () => {
                state.token = tokenInput.value.trim();
            };
            
            gistInput.oninput = () => {
                state.gistId = gistInput.value.trim();
            };
            
            // Cleanup button - removes tokens from stored state
            cleanupBtn.onclick = () => {
                cleanupBtn.disabled = true;
                cleanupBtn.textContent = 'CLEANING...';
                
                try {
                    const stateStr = localStorage.getItem('gt50-tester-state');
                    if (stateStr) {
                        const state = JSON.parse(stateStr);
                        let cleaned = false;
                        
                        if (state.impex && state.impex.cloudSync) {
                            if (state.impex.cloudSync.token) {
                                delete state.impex.cloudSync.token;
                                cleaned = true;
                            }
                            if (state.impex.cloudSync.gistId) {
                                delete state.impex.cloudSync.gistId;
                                cleaned = true;
                            }
                        }
                        
                        if (cleaned) {
                            localStorage.setItem('gt50-tester-state', JSON.stringify(state));
                            statusDiv.innerHTML = `
                                <div style="
                                    background: var(--accent);
                                    border: var(--border-width) solid var(--border-color);
                                    border-radius: 8px;
                                    padding: 12px;
                                    color: var(--color-10);
                                    font-size: 12px;
                                ">✓ Cleaned! Token removed from stored data. Now you can set up fresh.</div>
                            `;
                        } else {
                            statusDiv.innerHTML = `
                                <div style="
                                    background: var(--bg-4);
                                    border: var(--border-width) solid var(--border-color);
                                    border-radius: 8px;
                                    padding: 12px;
                                    color: var(--color-10);
                                    font-size: 12px;
                                ">✓ No cleanup needed. Data is already clean.</div>
                            `;
                        }
                        
                        cleanupBtn.textContent = '✓ CLEANED';
                        setTimeout(() => {
                            cleanupBtn.disabled = false;
                            cleanupBtn.textContent = '🧹 CLEAN OLD DATA FIRST';
                        }, 3000);
                    }
                } catch (error) {
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--error-bg);
                            border: var(--border-width) solid var(--error-border);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--error-color);
                            font-size: 12px;
                        ">Error: ${error.message}</div>
                    `;
                    cleanupBtn.disabled = false;
                    cleanupBtn.textContent = '🧹 CLEAN OLD DATA FIRST';
                }
            };
            
            cleanupBtn.onmouseover = () => cleanupBtn.style.filter = 'brightness(1.1)';
            cleanupBtn.onmouseout = () => cleanupBtn.style.filter = 'brightness(1)';
            
            setupBtn.onclick = async () => {
                const token = tokenInput.value.trim();
                const gistId = gistInput.value.trim();
                
                if (!token) {
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--error-bg);
                            border: var(--border-width) solid var(--error-border);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--error-color);
                            font-size: 12px;
                        ">Please enter a GitHub token</div>
                    `;
                    return;
                }
                
                setupBtn.disabled = true;
                setupBtn.textContent = 'TESTING TOKEN...';
                
                try {
                    // Step 1: Test the token
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--bg-4);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--color-10);
                            font-size: 12px;
                        ">Testing token...</div>
                    `;
                    
                    const tokenTest = await this.testToken(token);
                    
                    if (!tokenTest.success) {
                        throw new Error(`Token test failed: ${tokenTest.error}`);
                    }
                    
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--accent);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--color-10);
                            font-size: 12px;
                        ">✓ Token valid (${tokenTest.username})</div>
                    `;
                    
                    await new Promise(resolve => setTimeout(resolve, 500));
                    
                    // Step 2: Handle gist
                    setupBtn.textContent = 'SETTING UP GIST...';
                    let finalGistId = gistId;
                    
                    // If no Gist ID provided, create a new one
                    if (!finalGistId) {
                        statusDiv.innerHTML = `
                            <div style="
                                background: var(--bg-4);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                padding: 12px;
                                color: var(--color-10);
                                font-size: 12px;
                            ">Creating new Gist...</div>
                        `;
                        
                        finalGistId = await this.createGist(token);
                    } else {
                        // Verify existing gist
                        statusDiv.innerHTML = `
                            <div style="
                                background: var(--bg-4);
                                border: var(--border-width) solid var(--border-color);
                                border-radius: 8px;
                                padding: 12px;
                                color: var(--color-10);
                                font-size: 12px;
                            ">Verifying Gist...</div>
                        `;
                        
                        const cloudState = await this.getCloudState(token, finalGistId);
                        
                        if (cloudState && cloudState.error) {
                            if (cloudState.error === 404) {
                                throw new Error('Gist not found. Leave Gist ID empty to create a new one.');
                            } else {
                                throw new Error(`Gist error ${cloudState.error}: ${cloudState.message}`);
                            }
                        }
                    }
                    
                    // Step 3: Save and enable
                    this.saveCredentials(token, finalGistId);
                    state.enabled = true;
                    this.setEnabled(true);
                    
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--accent);
                            border: var(--border-width) solid var(--border-color);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--color-10);
                            font-size: 12px;
                        ">✓ Cloud sync enabled! Gist ID: ${finalGistId}<br/>Auto-syncing every 60 seconds.</div>
                    `;
                    
                    setupBtn.textContent = '✓ ENABLED';
                    
                    // Trigger immediate sync
                    setTimeout(() => {
                        this.smartSync();
                        onChange();
                    }, 1000);
                    
                } catch (error) {
                    statusDiv.innerHTML = `
                        <div style="
                            background: var(--error-bg);
                            border: var(--border-width) solid var(--error-border);
                            border-radius: 8px;
                            padding: 12px;
                            color: var(--error-color);
                            font-size: 12px;
                        ">❌ ${error.message}</div>
                    `;
                    
                    setupBtn.disabled = false;
                    setupBtn.textContent = 'ENABLE SYNC';
                }
            };
            
            setupBtn.onmouseover = () => setupBtn.style.filter = 'brightness(1.1)';
            setupBtn.onmouseout = () => setupBtn.style.filter = 'brightness(1)';
        },
        
        // ===== RENDER ACTIVE SYNC =====
        renderActive: function(container, state, onChange) {
            const lastSync = localStorage.getItem(this.STORAGE_KEY_LAST_SYNC);
            const timeAgoStr = this.timeAgo(lastSync);
            const savedGistId = localStorage.getItem(this.STORAGE_KEY_GIST_ID) || 'Unknown';
            
            let statusColor = 'var(--color-9)';
            let statusIcon = '●';
            
            if (this.syncStatus === 'syncing') {
                statusColor = 'var(--color-3)';
                statusIcon = '⟳';
            } else if (this.syncStatus === 'success') {
                statusColor = 'var(--accent)';
                statusIcon = '✓';
            } else if (this.syncStatus === 'error') {
                statusColor = 'var(--error-color)';
                statusIcon = '✗';
            }
            
            container.innerHTML = `
                <div style="padding: var(--margin); display: flex; flex-direction: column; gap: var(--margin);">
                    
                    <!-- Status Card -->
                    <div style="
                        background: var(--bg-4);
                        border: var(--border-width) solid var(--border-color);
                        border-radius: 8px;
                        padding: 16px;
                    ">
                        <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 12px;">
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
                        Auto-sync runs every 60 seconds in the background. Your data is automatically pushed when local changes are detected, and pulled when cloud has newer data.
                    </div>
                </div>
                
                <style>
                    @keyframes pulse {
                        0%, 100% { opacity: 1; }
                        50% { opacity: 0.3; }
                    }
                </style>
            `;
            
            const manualSyncBtn = container.querySelector('#manual-sync-btn');
            const disableBtn = container.querySelector('#disable-btn');
            
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
            
            disableBtn.onclick = () => {
                if (confirm('Are you sure you want to disable cloud sync? Your local data will remain safe.')) {
                    state.enabled = false;
                    this.setEnabled(false);
                    onChange();
                }
            };
            
            manualSyncBtn.onmouseover = () => manualSyncBtn.style.filter = 'brightness(1.1)';
            manualSyncBtn.onmouseout = () => manualSyncBtn.style.filter = 'brightness(1)';
            disableBtn.onmouseover = () => disableBtn.style.filter = 'brightness(1.1)';
            disableBtn.onmouseout = () => disableBtn.style.filter = 'brightness(1)';
        },
        
        // ===== MAIN RENDER =====
        render: function(container, state, onChange) {
            // Always check localStorage, not state (in case state got cleared on reload)
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
        // CRITICAL: Clean any tokens from stored state (security fix)
        const stateStr = localStorage.getItem('gt50-tester-state');
        if (stateStr) {
            try {
                const state = JSON.parse(stateStr);
                let needsSave = false;
                
                // Remove token/gistId if present (legacy cleanup)
                if (state.impex && state.impex.cloudSync) {
                    if (state.impex.cloudSync.token) {
                        delete state.impex.cloudSync.token;
                        needsSave = true;
                        console.log('🔒 Removed token from stored state (security fix)');
                    }
                    if (state.impex.cloudSync.gistId) {
                        delete state.impex.cloudSync.gistId;
                        needsSave = true;
                        console.log('🔒 Removed gistId from stored state (security fix)');
                    }
                }
                
                if (needsSave) {
                    localStorage.setItem('gt50-tester-state', JSON.stringify(state));
                }
            } catch (error) {
                console.error('Error cleaning state:', error);
            }
        }
        
        const enabled = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_ENABLED) === 'true';
        const token = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_TOKEN);
        const gistId = localStorage.getItem(GT50Lib.CloudSync.STORAGE_KEY_GIST_ID);
        
        if (enabled && token && gistId) {
            console.log('🚀 Auto-starting cloud sync...');
            GT50Lib.CloudSync.autoSyncEnabled = true;
            GT50Lib.CloudSync.startAutoSync();
        }
    });
    
    console.log('✓ CloudSync component loaded');
})();
