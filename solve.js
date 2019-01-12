function replaceAt(char,pos,str) {
	return str.substr(0, pos) + char+ str.substr(pos + char.length);
}

class SanArray {
	constructor(str,parent) {
		this.array = [];
		this.separators = [];
		let subArray = false;
		let parentheses = 0;
		let separator = false;
		let marker = 0;
		if(!parent) {
			this.parent = null;
		} else {
			this.parent = parent;
		}
		str = str.substring(2, str.length - 1); 
		for(let i = 0; i < str.length; i++) {
			if(subArray) {
				if(str[i] === "(") {
					parentheses++;
				}
				if(str[i] === ")") {
					parentheses--;
				}
				if(parentheses === 0) {
					subArray = false;
				}
			} else if(separator) {
				if(str[i] === "{") {
					parentheses++;
				}
				if(str[i] === "}") {
					parentheses--;
				}
				if(parentheses === 0) {
					separator = false;
					let sep = str.substring(marker+1,i-1);
					this.separators.push(new Separator(sep),this);
					str = str.replace(sep," ");
				}
			} else {
				if(str[i] === ",") {
					str = str.replace(","," ");
					this.separators.push(new Separator("1"),this);
				}
				if(str[i-1] === "s" && str[i] === "(") {
					subArray = true;
					parentheses++;
				}
				if(str[i] === "{") {
					separator = true;
					parentheses++;
					marker = i;
				}
			}
			console.log(str);
		}
		let array = str.split(" ");
		for(let i = 0; i < array.length; i++) {
			if(array[i][1] === "s") {
				array[i] = new SanArray(array[i],this);
			} else {
				array[i] = parseInt(array[i]);
			}
		}
		this.array = array;
		this.base = this.array.shift();
		this.iterator = this.array.shift();
		this.separators.shift();
		this.separators.shift();
	}
}

class Separator {
	constructor(str,parent) {
		this.array = [];
		this.separators = [];
		let subArray = false;
		let parentheses = 0;
		let separator = false;
		let marker = 0;
		this.parent = parent;
		for(let i = 0; i < str.length; i++) {
			if(subArray) {
				if(str[i] === "(") {
					parentheses++;
				}
				if(str[i] === ")") {
					parentheses--;
				}
				if(parentheses === 0) {
					subArray = false;
				}
			} else if(separator) {
				if(str[i] === "{") {
					parentheses++;
				}
				if(str[i] === "}") {
					parentheses--;
				}
				if(parentheses === 0) {
					separator = false;
					let sep = str.substring(marker+1,i-1);
					this.separators.push(new Separator(sep),this);
					str = str.replace(" ",sep);
				}
			} else {
				if(str[i] === ",") {
					str = str.replace(" ",str[i]);
					this.separators.push(new Separator(1),this);
				}
				if(str[i-1] === "s" && str[i] === "(") {
					subArray = true;
					parentheses++;
				}
				if(str[i] === "{") {
					separator = true;
					parentheses++;
					marker = i;
				}
			}
			console.log(str);
		}
		let array = str.split(" ");
		for(let i = 0; i < array.length; i++) {
			if(array[i][1] === "s") {
				array[i] = new SanArray(array[i],this);
			} else {
				array[i] = parseInt(array[i]);
			}
		}
		this.array = array;
	}
}
