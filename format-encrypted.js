(function() {
    // Static injector ID
    const INJECTOR_ID = '0022';
    
    // ===== ULTRA-COMPACT FORMAT ADAPTER =====
    // Maximum compression: GT50 format + LZ-String UTF16 encoding
    // More reliable version that doesn't depend on Ultra format
    
    const UltraCompactFormat = {
        // ===== FORMAT INFO =====
        getFormatName: function() {
            return 'Ultra-Compact';
        },
        
        getDescription: function() {
            return 'Maximum compression (UTF16)';
        },
        
        getVersion: function() {
            return '1.0.0';
        },
        
        getFileExtension: function() {
            return 'gt50uc';
        },
        
        // ===== SERIALIZE (JSON → Ultra-Compact format) =====
        serialize: function(jsonData) {
            console.log('=== ULTRA-COMPACT SERIALIZE START ===');
            
            try {
                // Check LZ-String
                if (!window.LZString) {
                    console.error('LZ-String library not loaded!');
                    throw new Error('LZ-String library not loaded');
                }
                console.log('✓ LZ-String loaded');
                
                // Find GT50 adapter
                const GT50Adapter = window.GT50Lib.ImpEx.formatAdapters.find(f => 
                    f.getFormatName() === 'GT50'
                );
                
                if (!GT50Adapter) {
                    console.error('GT50 format adapter not found!');
                    console.log('Available formats:', window.GT50Lib.ImpEx.formatAdapters.map(f => f.getFormatName()));
                    throw new Error('GT50 format adapter not found');
                }
                console.log('✓ GT50 adapter found');
                
                // Convert to GT50 text format
                const gt50Text = GT50Adapter.serialize(jsonData);
                console.log('✓ GT50 text generated:', gt50Text.length, 'chars');
                
                // Compress with LZ-String to UTF16
                const compressed = LZString.compressToUTF16(gt50Text);
                console.log('✓ Compressed to UTF16:', compressed.length, 'chars');
                
                console.log('=== COMPRESSION STATS ===');
                console.log('GT50 format:', gt50Text.length, 'chars');
                console.log('Ultra-Compact:', compressed.length, 'chars');
                console.log('Compression ratio:', (compressed.length / gt50Text.length * 100).toFixed(1) + '%');
                console.log('Overall savings:', ((1 - compressed.length / gt50Text.length) * 100).toFixed(1) + '%');
                
                return compressed;
                
            } catch (error) {
                console.error('=== ULTRA-COMPACT SERIALIZE ERROR ===');
                console.error('Error:', error.message);
                console.error('Stack:', error.stack);
                throw error; // Re-throw so ImpEx can handle it
            }
        },
        
        // ===== DESERIALIZE (Ultra-Compact format → JSON) =====
        deserialize: function(formatData) {
            console.log('=== ULTRA-COMPACT DESERIALIZE START ===');
            
            try {
                // Check LZ-String
                if (!window.LZString) {
                    console.error('LZ-String library not loaded!');
                    throw new Error('LZ-String library not loaded');
                }
                console.log('✓ LZ-String loaded');
                
                // Decompress from UTF16
                const gt50Text = LZString.decompressFromUTF16(formatData);
                
                if (!gt50Text) {
                    console.error('Decompression returned null/empty!');
                    throw new Error('Decompression failed - invalid data');
                }
                console.log('✓ Decompressed to GT50:', gt50Text.length, 'chars');
                
                // Show sample
                console.log('=== DECOMPRESSED SAMPLE (first 500 chars) ===');
                console.log(gt50Text.substring(0, 500));
                
                // Find GT50 adapter
                const GT50Adapter = window.GT50Lib.ImpEx.formatAdapters.find(f => 
                    f.getFormatName() === 'GT50'
                );
                
                if (!GT50Adapter) {
                    console.error('GT50 format adapter not found!');
                    throw new Error('GT50 format adapter not found');
                }
                console.log('✓ GT50 adapter found');
                
                // Parse GT50 to JSON
                const jsonData = GT50Adapter.deserialize(gt50Text);
                console.log('✓ Parsed to JSON');
                
                // Show tab names
                console.log('=== IMPORTED TAB NAMES ===');
                if (jsonData.data.tabs && jsonData.data.tabs.tabs) {
                    jsonData.data.tabs.tabs.forEach((tab, i) => {
                        console.log(`Tab ${i}: "${tab.name}" / "${tab.label}"`);
                    });
                }
                
                // Show nest names
                console.log('=== IMPORTED NEST/CYCLE NAMES ===');
                function logNestNames(comps, depth = 0) {
                    comps.flat().forEach(c => {
                        if (c.type === 'nest' || c.type === 'cycle') {
                            console.log(`${'  '.repeat(depth)}${c.type}: "${c.state.name}" / "${c.state.title}"`);
                            if (c.state.tabComponents) {
                                logNestNames(c.state.tabComponents, depth + 1);
                            }
                        }
                    });
                }
                if (jsonData.data.tabComponents) {
                    logNestNames(jsonData.data.tabComponents);
                }
                
                return jsonData;
                
            } catch (error) {
                console.error('=== ULTRA-COMPACT DESERIALIZE ERROR ===');
                console.error('Error:', error.message);
                console.error('Stack:', error.stack);
                throw error;
            }
        },
        
        // ===== VALIDATE =====
        validate: function(formatData) {
            console.log('=== ULTRA-COMPACT VALIDATE START ===');
            
            try {
                // Check LZ-String
                if (!window.LZString) {
                    console.error('LZ-String library not loaded!');
                    return { valid: false, error: 'LZ-String library not loaded' };
                }
                
                // Check if it's a string
                if (typeof formatData !== 'string' || formatData.length === 0) {
                    console.error('Invalid data: not a string or empty');
                    return { valid: false, error: 'Invalid data format' };
                }
                
                console.log('Validating', formatData.length, 'chars');
                
                // Try to deserialize
                const result = this.deserialize(formatData);
                
                if (!result.data || !result.data.tabs || !result.data.tabComponents) {
                    console.error('Invalid structure after deserialize');
                    return { valid: false, error: 'Invalid data structure' };
                }
                
                console.log('✓ Validation passed');
                return { 
                    valid: true,
                    compressed: true,
                    maxCompression: true
                };
            } catch (error) {
                console.error('Validation error:', error.message);
                return { valid: false, error: error.message };
            }
        }
    };
    
    // ===== LOAD LZ-STRING LIBRARY AND REGISTER =====
    function loadLZStringAndRegister() {
        console.log('=== ULTRA-COMPACT FORMAT INITIALIZATION ===');
        
        // Check if already loaded
        if (window.LZString) {
            console.log('✓ LZ-String already loaded');
            registerFormat();
            return;
        }
        
        console.log('Loading LZ-String from CDN...');
        
        // Load from CDN
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/lz-string/1.5.0/lz-string.min.js';
        script.onload = () => {
            console.log('✓ LZ-String library loaded from CDN');
            registerFormat();
        };
        script.onerror = () => {
            console.error('✗ Failed to load LZ-String library from CDN');
        };
        document.head.appendChild(script);
    }
    
    function registerFormat() {
        if (window.GT50Lib && window.GT50Lib.ImpEx) {
            window.GT50Lib.ImpEx.registerFormat(UltraCompactFormat);
            console.log('✓ Ultra-Compact format registered successfully');
            console.log('Available formats:', window.GT50Lib.ImpEx.formatAdapters.map(f => f.getFormatName()).join(', '));
        } else {
            console.warn('✗ GT50Lib.ImpEx not yet loaded, format not registered');
            // Try again in 100ms
            setTimeout(() => {
                if (window.GT50Lib && window.GT50Lib.ImpEx) {
                    window.GT50Lib.ImpEx.registerFormat(UltraCompactFormat);
                    console.log('✓ Ultra-Compact format registered successfully (delayed)');
                    console.log('Available formats:', window.GT50Lib.ImpEx.formatAdapters.map(f => f.getFormatName()).join(', '));
                } else {
                    console.error('✗ GT50Lib.ImpEx still not available after delay');
                }
            }, 100);
        }
    }
    
    // Initialize
    loadLZStringAndRegister();
})();