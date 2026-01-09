const { createApp } = Vue;

createApp({
    data() {
        return {
            loading: false,
            currentBuild: [],
            spells: [
                // Offensive
                { name: 'Bouncer', type: 'Offensive', icon: 'SpellSmalliconBouncer.webp' },
                { name: 'Chakram', type: 'Offensive', icon: 'SpellSmalliconChakram.webp' },
                { name: 'Crescent', type: 'Offensive', icon: 'SpellSmalliconCrescent.webp' },
                { name: 'Fireball', type: 'Offensive', icon: 'SpellSmalliconFireball.webp' },
                { name: 'Frostbolt', type: 'Offensive', icon: 'SpellSmalliconFrostbolt.webp' },
                { name: 'Homing', type: 'Offensive', icon: 'SpellSmalliconHoming.webp' },
                { name: 'Magic Missile', type: 'Offensive', icon: 'SpellSmalliconMagicMissile.webp' },
                { name: 'Shock', type: 'Offensive', icon: 'SpellSmalliconSchock.webp' },

                // Defensive
                { name: 'Counter Pulse', type: 'Defensive', icon: 'SpellSmalliconCounterPulse.webp' },
                { name: 'Energy Shield', type: 'Defensive', icon: 'SpellSmalliconEnergyShield.webp' },
                { name: 'Lockdown', type: 'Defensive', icon: 'SpellSmalliconLockdown.webp' },
                { name: 'Phase Shift', type: 'Defensive', icon: 'SpellSmalliconPhaseShift.webp' },
                { name: 'Rock Pillar', type: 'Defensive', icon: 'SpellSmalliconRockPillar.webp' },
                { name: 'Time Anchor', type: 'Defensive', icon: 'SpellSmalliconTimeAnchor.webp' },
                { name: 'Windwalk', type: 'Defensive', icon: 'SpellSmalliconWindwalk.webp' },
                { name: 'Consuming Void', type: 'Defensive', icon: 'SpellSmalliconConsumingVoid.webp' },

                // Area Spell
                { name: 'Gravity', type: 'Area', icon: 'SpellSmalliconGravity.webp' },
                { name: 'Lightning Strike', type: 'Area', icon: 'SpellSmalliconLightningStrike.webp' },
                { name: 'Meteor', type: 'Area', icon: 'SpellSmalliconMeteor.webp' },
                { name: 'Acid Pool', type: 'Area', icon: 'SpellSmalliconAcidPool.webp' },
                { name: 'Arcane Mines', type: 'Area', icon: 'SpellSmalliconArcaneMines.webp' },
                
                // Utility
                { name: 'Chain Hook', type: 'Utility', icon: 'SpellSmalliconChainHook.webp' },
                { name: 'Dimension Gate', type: 'Utility', icon: 'SpellSmalliconDimensionGate.webp' },
                { name: 'Speed Boost', type: 'Utility', icon: 'SpellSmalliconSpeedBoost.webp' },
                { name: 'Fetch', type: 'Utility', icon: 'SpellSmalliconFetch.webp' },
                { name: 'Time Zone', type: 'Utility', icon: 'SpellSmalliconTimeZone.webp' },

                // Travel
                { name: 'Blink', type: 'Travel', icon: 'SpellSmalliconBlink.webp' },
                { name: 'Charge', type: 'Travel', icon: 'SpellSmalliconCharge.webp' },
                { name: 'Swap Ball', type: 'Travel', icon: 'SpellSmalliconSwapBall.webp' },
                { name: 'Side Step', type: 'Travel', icon: 'SpellSmalliconSideStep.webp' },
                { name: 'Orb of travel', type: 'Travel', icon: 'SpellSmalliconOrbTravel.png' },
            ],
            limits: {
                'Offensive': 3,
                'Defensive': 1,
                'Area': 1,
                'Utility': 4,
                'Travel': 1
            }
        };
    },
    computed: {
        buildStats() {
            const stats = {
                offensive: 0,
                defensive: 0,
                area: 0,
                utility: 0,
                travel: 0
            };
            
            this.currentBuild.forEach(spell => {
                const type = spell.type.toLowerCase();
                if (stats.hasOwnProperty(type)) {
                    stats[type]++;
                }
            });
            
            return stats;
        }
    },
    methods: {
        getIconPath(iconName) {
            return `assets/${iconName}`;
        },
        
        generateRandomBuild() {
            this.loading = true;
            
            setTimeout(() => {
                const build = [];
                const typeCounts = {
                    'Offensive': 0,
                    'Defensive': 0,
                    'Area': 0,
                    'Utility': 0,
                    'Travel': 0
                };
                
                // Shuffle spells array
                const shuffled = this.shuffleArray([...this.spells]);
                
                // Select up to 7 spells total, respecting maximum limits per type
                for (const spell of shuffled) {
                    // Stop when we have 7 spells total
                    if (build.length >= 7) {
                        break;
                    }
                    
                    const currentCount = typeCounts[spell.type];
                    const limit = this.limits[spell.type];
                    
                    // Only add if we haven't reached the limit for this type
                    if (currentCount < limit) {
                        build.push(spell);
                        typeCounts[spell.type]++;
                    }
                }
                
                // Shuffle the final build for random order
                let shuffledBuild = this.shuffleArray(build);
                
                // Ensure at least one offensive spell is in the first 3 spells
                const firstThree = shuffledBuild.slice(0, 3);
                const hasOffensiveInFirstThree = firstThree.some(spell => spell.type === 'Offensive');
                
                if (!hasOffensiveInFirstThree) {
                    // Find the first offensive spell in the build
                    const offensiveIndex = shuffledBuild.findIndex(spell => spell.type === 'Offensive');
                    
                    if (offensiveIndex !== -1) {
                        // Find the first non-offensive spell in positions 0-2
                        const nonOffensiveIndex = shuffledBuild.findIndex((spell, index) => 
                            index < 3 && spell.type !== 'Offensive'
                        );
                        
                        if (nonOffensiveIndex !== -1) {
                            // Swap them
                            [shuffledBuild[nonOffensiveIndex], shuffledBuild[offensiveIndex]] = 
                            [shuffledBuild[offensiveIndex], shuffledBuild[nonOffensiveIndex]];
                        }
                    }
                }
                
                this.currentBuild = shuffledBuild;
                
                this.loading = false;
            }, 300);
        },
        
        shuffleArray(array) {
            const newArray = [...array];
            for (let i = newArray.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
            }
            return newArray;
        }
    }
}).mount('#app');
