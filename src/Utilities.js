const Utilities = {
	getAddresses: function (key) {
		return JSON.parse(window.localStorage.getItem(key))
	},

	saveAddresses: function (key, value) {
		let data = this.getAddresses(key)
		if (data) {
			data.push(value)
		} else {
			data = [value]
		}
		window.localStorage.setItem(key, JSON.stringify(data))
	},

	isIoPayMobile: function () {
		return navigator.userAgent && (navigator.userAgent.includes("IoPayAndroid") || navigator.userAgent.includes("IoPayiOs"));
	}
}

export default Utilities