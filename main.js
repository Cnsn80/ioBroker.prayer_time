"use strict";

/*
 * Created with @iobroker/create-adapter v2.3.0
 */

// The adapter-core module gives you access to the core ioBroker functions
// you need to create an adapter
const utils = require("@iobroker/adapter-core");
const request = require('request-promise-native');
// Load your modules here, e.g.:
// const fs = require("fs");

class PrayerTime extends utils.Adapter {

	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	constructor(options) {
		super({...options, name: "prayer_time",});
		this.on("ready", this.onReady.bind(this));
		this.on("stateChange", this.onStateChange.bind(this));
		// this.on("objectChange", this.onObjectChange.bind(this));
		// this.on("message", this.onMessage.bind(this));
		this.on("unload", this.onUnload.bind(this));
	}
module.exports = PrayerTime;
	/**
	 * Is called when databases are connected and adapter received configuration.
	 */
	async onReady() {
		// Initialize your adapter here
const request = require('request');

// Set up your adapter using the iobroker.Adapter constructor
class MyAdapter extends iobroker.Adapter {
    constructor(options) {
        super(options);
        this.on('ready', this.onReady.bind(this));
        this.on('stateChange', this.onStateChange.bind(this));
        this.on('unload', this.onUnload.bind(this));
    }

    // This function is called when the adapter is first loaded
    onReady() {
        // Set the state of the adapter
        this.setState('info.connection', true, true);
        // Start the timer to fetch the prayer times every day
        this.fetchPrayerTimes();
        this.timer = setInterval(this.fetchPrayerTimes.bind(this), 86400 * 1000);
    }

    // This function is called when the adapter is being unloaded
    onUnload(callback) {
        try {
            clearInterval(this.timer);
            this.setState('info.connection', false, true);
            callback();
        } catch (e) {
            callback();
        }
    }

    // This function is called when the state of the adapter changes
    onStateChange(id, state) {
        if (state) {
            // The state has changed, do something here
        }
    }

    // This function fetches the prayer times from the API and updates the states
    fetchPrayerTimes() {
        // Set the city and country for which you want to get the prayer times
        const city = 'Berlin';
        const country = 'Germany';

        // Set the API endpoint and your API key
        const endpoint = `http://api.aladhan.com/v1/calendarByCity?city=${city}&country=${country}&method=2`;
        const apiKey = 'your-api-key-here';

        // Set the headers for the HTTP request
        const headers = {
            'Content-Type': 'application/json',
            'x-api-key': apiKey
        };

        // Send the HTTP request to the API
        request({ url: endpoint, headers: headers }, (error, response, body) => {
            if (error) {
                // There was an error, set the states accordingly
                this.setState('error', error.message, true);
                this.setState('info.connection', false, true);
                return;
            }

            // Parse the response from the API
            const data = JSON.parse(body);
            if (data.code !== 200) {
                // There was an error, set the states accordingly
                this.setState('error', data.status, true);
                this.setState('info.connection', false, true);
                return;
            }
            // Extract the prayer times from the response
            const fajr = data.data[0].timings.Fajr;
            const dhuhr = data.data[0].timings.Dhuhr;
            const asr = data.data[0].timings.Asr;
            const maghrib = data.data[0].timings.Maghrib;
            const isha = data.data[0].timings.Isha;

            // Set the states for the prayer times
            this.setState('prayerTimes.fajr', fajr, true);
            this.setState('prayerTimes.dhuhr', dhuhr, true);
            this.setState('prayerTimes.asr', asr, true);
            this.setState('prayerTimes.maghrib', maghrib, true);
            this.setState('prayerTimes.isha', isha, true);

            // Set the state to indicate a successful connection
            this.setState('info.connection', true, true);
        });
    }
}

// Export the adapter
module.exports = MyAdapter;


}

// Aufrufen der Funktion beim Start des Adapters
getPrayerTimes();

		// Reset the connection indicator during startup
		this.setState("info.connection", false, true);

		// The adapters config (in the instance object everything under the attribute "native") is accessible via
		// this.config:
		this.log.info("config Sabah: " + this.config.Sabah);
		this.log.info("config Ögle: " + this.config.Ögle);
		this.log.info("config ikindi: " + this.config.ikindi);
		this.log.info("config Aksam: " + this.config.Aksam);
		this.log.info("config Yatsi: " + this.config.Yatsi);

		/*
		For every state in the system there has to be also an object of type state
		Here a simple template for a boolean variable named "testVariable"
		Because every adapter instance uses its own unique namespace variable names can't collide with other adapters variables
		*/
		await this.setObjectNotExistsAsync("testVariable", {
			type: "state",
			common: {
				name: "testVariable",
				type: "boolean",
				role: "indicator",
				read: true,
				write: true,
			},
			native: {},
		});

		// In order to get state updates, you need to subscribe to them. The following line adds a subscription for our variable we have created above.
		this.subscribeStates("testVariable");
		// You can also add a subscription for multiple states. The following line watches all states starting with "lights."
		// this.subscribeStates("lights.*");
		// Or, if you really must, you can also watch all states. Don't do this if you don't need to. Otherwise this will cause a lot of unnecessary load on the system:
		// this.subscribeStates("*");

		/*
			setState examples
			you will notice that each setState will cause the stateChange event to fire (because of above subscribeStates cmd)
		*/
		// the variable testVariable is set to true as command (ack=false)
		await this.setStateAsync("testVariable", true);

		// same thing, but the value is flagged "ack"
		// ack should be always set to true if the value is received from or acknowledged from the target system
		await this.setStateAsync("testVariable", { val: true, ack: true });

		// same thing, but the state is deleted after 30s (getState will return null afterwards)
		await this.setStateAsync("testVariable", { val: true, ack: true, expire: 30 });

		// examples for the checkPassword/checkGroup functions
		let result = await this.checkPasswordAsync("admin", "iobroker");
		this.log.info("check user admin pw iobroker: " + result);

		result = await this.checkGroupAsync("admin", "admin");
		this.log.info("check group user admin group admin: " + result);
	}

	/**
	 * Is called when adapter shuts down - callback has to be called under any circumstances!
	 * @param {() => void} callback
	 */
	onUnload(callback) {
		try {
			// Here you must clear all timeouts or intervals that may still be active
			// clearTimeout(timeout1);
			// clearTimeout(timeout2);
			// ...
			// clearInterval(interval1);

			callback();
		} catch (e) {
			callback();
		}
	}

	// If you need to react to object changes, uncomment the following block and the corresponding line in the constructor.
	// You also need to subscribe to the objects with `this.subscribeObjects`, similar to `this.subscribeStates`.
	// /**
	//  * Is called if a subscribed object changes
	//  * @param {string} id
	//  * @param {ioBroker.Object | null | undefined} obj
	//  */
	// onObjectChange(id, obj) {
	// 	if (obj) {
	// 		// The object was changed
	// 		this.log.info(`object ${id} changed: ${JSON.stringify(obj)}`);
	// 	} else {
	// 		// The object was deleted
	// 		this.log.info(`object ${id} deleted`);
	// 	}
	// }

	/**
	 * Is called if a subscribed state changes
	 * @param {string} id
	 * @param {ioBroker.State | null | undefined} state
	 */
	onStateChange(id, state) {
		if (state) {
			// The state was changed
			this.log.info(`state ${id} changed: ${state.val} (ack = ${state.ack})`);
		} else {
			// The state was deleted
			this.log.info(`state ${id} deleted`);
		}
	}

	// If you need to accept messages in your adapter, uncomment the following block and the corresponding line in the constructor.
	// /**
	//  * Some message was sent to this instance over message box. Used by email, pushover, text2speech, ...
	//  * Using this method requires "common.messagebox" property to be set to true in io-package.json
	//  * @param {ioBroker.Message} obj
	//  */
	// onMessage(obj) {
	// 	if (typeof obj === "object" && obj.message) {
	// 		if (obj.command === "send") {
	// 			// e.g. send email or pushover or whatever
	// 			this.log.info("send command");

	// 			// Send response in callback if required
	// 			if (obj.callback) this.sendTo(obj.from, obj.command, "Message received", obj.callback);
	// 		}
	// 	}
	// }

}

if (require.main !== module) {
	// Export the constructor in compact mode
	/**
	 * @param {Partial<utils.AdapterOptions>} [options={}]
	 */
	module.exports = (options) => new PrayerTime(options);
} else {
	// otherwise start the instance directly
	new PrayerTime();
}
