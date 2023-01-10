'use strict';

const request = require('request-promise-native');
const utils = require('@iobroker/adapter-core');

class PrayerTime extends utils.Adapter {
    constructor(options) {
        super({...options, name: 'prayer_time'});
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));

        this.log.info('constructor');
    }

    async onReady() {
        // Create input fields for city, state, and method
        await this.setObjectAsync('city', {
            type: 'state',
            common: {
                name: 'City',
                type: 'string',
                role: 'input',
                read: true,
                write: true
            },
            native: {}
        });
        await this.setObjectAsync('state', {
            type: 'state',
            common: {
                name: 'State/Country',
                type: 'string',
                role: 'input',
                read: true,
                write: true
            },
            native: {}
        });
        await this.setObjectAsync('method', {
            type: 'state',
            common: {
                name: 'Method',
                type: 'number',
                role: 'input',
                read: true,
                write: true
            },
            native: {}
        });
        this.log.info('Input fields created');
    }

    async onStateChange(id, state) {
        if (id === this.namespace + '.city' || id === this.namespace + '.state' || id === this.namespace + '.method') {
            this.log.info(`Input field ${id} changed to ${state.val}`);
            const city = this.getState('city').val;
            const state = this.getState('state').val;
            const method = this.getState('method').val;

            if (city && state && method) {
                this.log.info(`Getting prayer times for ${city}, ${state} using method ${method}`);
                try {
                    const times = await this.getPrayerTimes(city, state, method);
                    this.log.info('Prayer times successfully retrieved:');
                    this.log.info(times);
                } catch (error) {
                    this.log.error(`Error retrieving prayer times: ${error}`);
                }
            }
        }
    }

    async onUnload(callback) {
        try {
            // Perform cleanup tasks here...
            callback();
        } catch (e) {
            callback();
        }
    }
    
    async getPrayerTimes(city, state, method) {
        // Set default method to '2' (Islamic Society of North America) if not provided
        method = method || '2';

        // Build request options
        const options = {
            method: 'GET',
            uri
