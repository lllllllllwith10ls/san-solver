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
					let sep = str.substring(marker,i+1);
					this.separators.push(new Separator(sep,this));
					str = str.replace(sep," ");
					i = marker;
				}
			} else {
				if(str[i] === ",") {
					str = str.replace(","," ");
					this.separators.push(new Separator("1",this));
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
		}
		let array = str.split(" ");
		for(let i = 0; i < array.length; i++) {
			if(array[i][0] === "s") {
				array[i] = new SanArray(array[i],this);
			} else {
				array[i] = parseInt(array[i]);
			}
		}
		this.array = array;
		this.base = this.array.shift();
		this.iterator = this.array.shift();
		this.separators.shift();
	}
	clean() {
		let arraylength = this.array.length-1;
		while(this.array[arraylength] === 1) {
			arraylength = this.array.length-1;
		}
		for(let i = this.separators.length-1; i >= 1; i--) {
			while(this.array[i-1] <= 1 && this.array[i] > 1 && Separator.level(this.separators[i],this.separators[i-1]) === this.separators[i]) {
				this.array.splice(i-1,1);
				this.separators.splice(i-1,1);
				i--;
			}
		}
		for(let i = 1; i < this.separators.length; i++) {
			this.separators[i].clean();
		}
	}
	solve() {
		this.clean();
		if(this.iterator instanceof SanArray) {
			this.iterator.solve();
		} else if(this.array.length === 0) {
			return this.base**this.iterator;	
		} else if(this.separators[0].array === [1] && this.array[0] > 1) {
			let it = new SanArray(this.toString);
			it.iterator--;
			this.iterator = it;
			this.array[0]--;
		} else {
			let i = 0;
			while(this.array[i] <= 1) {
				i++;
			}
			if(this.array[i] instanceof SanArray) {
				this.array[i].solve();
			} else if(this.separators[i].array === [1]) {
				this.array[i]--;
				this.array[i-1] = this.iterator;
				for(let j = 0; j < i-1; j++) {
					this.array[j] = this.base;
				}
			} else {
				let newSep = new Separator(this.separators[i].toString(),this);
				this.array[i]--;
				this.separators.splice(i,0,newSep);
				this.array.splice(i,0,2);
				this.separators[i].solve(this.base,this.iterator);
			}
		}
		return this;
	}
	toString() {
		let str = "s(";
		str+=this.base+","+this.iterator;
		for(let i = 0; i < this.array.length; i++) {
			if(this.separators[i]) {
				str+=this.separators[i].toString();
			}
			if(this.array[i]) {
				str+=this.array[i]+"";
			}
		}
		str += ")";
		return str;
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
		str = str.substring(1, str.length - 1);
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
					let sep = str.substring(marker,i+1);
					this.separators.push(new Separator(sep,this));
					str = str.replace(sep," ");
				}
			} else {
				if(str[i] === ",") {
					str = str.replace(","," ");
					this.separators.push(new Separator("1",this));
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
		}
		let array = str.split(" ");
		for(let i = 0; i < array.length; i++) {
			if(array[i][0] === "s") {
				array[i] = new SanArray(array[i],this);
			} else {
				array[i] = parseInt(array[i]);
			}
		}
		this.array = array;
	}
	toString() {
		if(this.array.length === 1 && this.array[0] === 1) {
			return ",";
		} else {
			let str = "{";
			for(let i = 0; i < this.array.length; i++) {
				if(this.array[i]) {
					str+=this.array[i]+"";
				}
				if(this.separators[i]) {
					str+=this.separators[i].toString();
				}
			}
			str += "}";
			return str;
		}
	}
	clean() {
		let arraylength = this.array.length-1;
		while(this.array[arraylength-1] === 1 && (this.array.length > 1 || this.array[0] > 1)) {
			this.array.pop();
			this.separators.pop();
			arraylength = this.array.length-1;
		}
		for(let i = this.separators.length-1; i >= 1; i--) {
			while(this.array[i] <= 1 && this.array[i+1] > 1 && Separator.level(this.separators[i],this.separators[i-1]) === this.separators[i]) {
				this.array.splice(i,1);
				this.separators.splice(i-1,1);
				i--;
			}
		}
		for(let i = 1; i < this.separators.length; i++) {
			this.separators[i].clean();
		}
	}
	static level(a,b) {
		if(a.array.length > 1 && b.array.length === 1) {
			return a;
		} else if(a.array.length === 1 && b.array.length > 1) {
			return b;
		} else if(a.array.length === 1 && b.array.length === 1) {
			if(a.array[0] > b.array[0]) {
				return a;
			} else if(a.array[0] < b.array[0]) {
				return b;
			} else {
				return "equal";
			}
		} else {
			let ma = [0];
			for(let i = 1; i < a.array.length; i++) {
				if(Separator.level(a.array[mb[0]],a.array[i]) === a.array[i]) {
					ma = [i];
				} else if(Separator.level(a.array[mb[0]],a.array[i]) === "equal") {
					ma.push(i);
				}
			}
			let mb = [0];
			for(let i = 1; i < b.array.length; i++) {
				if(Separator.level(b.array[mb[0]],b.array[i]) === b.array[i]) {
					mb = [i];
				} else if(Separator.level(b.array[mb[0]],b.array[i]) === "equal") {
					mb.push(i);
				}
			}
			if(Separator.level(a.array[ma[0]],b.array[mb[0]]) === a.array[ma[0]]) {
				return a;
			} else if(Separator.level(a.array[ma[0]],b.array[mb[0]]) === b.array[ma[0]]) {
				return b;
			} else if(ma.length > mb.length) {
				return a;
			} else if(ma.length < mb.length) {
				return b;
			} else {
				let part1 = new Separator(a.toString);
				let part2 = new Separator(a.toString);
				part1.array = part1.array.slice(0,ma[0]+1);
				part2.array = part2.array.slice(ma[0]+1);
				part1.separators = part1.separators.slice(0,ma[0]);
				part2.separators = part2.separators.slice(ma[0]+1);
				
				let part3 = new Separator(b.toString);
				let part4 = new Separator(b.toString);
				part3.array = part3.array.slice(0,mb[0]+1);
				part4.array = part4.array.slice(mb[0]+1);
				part3.separators = part3.separators.slice(0,mb[0]);
				part4.separators = part4.separators.slice(mb[0]+1);
				
				if(Separator.level(part2,part4) === part2) {
					return a;
				} else if(Separator.level(part2,part4) === part4) {
					return b;
				} else if(Separator.level(part1,part3) === part1) {
					return a;
				} else if(Separator.level(part1,part3) === part3) {
					return b;
				} else {
					return "equal";
				}
			}
		}
	}
	solve(base, iterator) {
		this.clean();
		
		let i = 0;
		while(this.array[i] <= 1) {
			i++;
		}
		if(this.array[i] instanceof SanArray) {
			this.array[i].solve();
		} else if(i === 0) {
			let index = this.parent.separators.indexOf(this);
			let reduced = new Separator(this.toString(),this.parent);
			reduced.array[0]--;
			let seps = [];
			let ones = [];
			
			for(let j = 0; j < iterator; j++) {
				seps.push(reduced);
				ones.push(1);
			}
			ones.pop();
			if(this.parent instanceof SanArray) {
				this.parent.separators.splice(index,1,...seps);
				this.parent.array.splice(index,0,...ones);
			} else {
				this.parent.separators.splice(index,1,...seps);
				this.parent.array.splice(index+1,0,...ones);
			}
		} else if(this.separators[i].array === [1]) {
			this.array[i+1]--;
			this.array[i] = iterator;
			for(let j = 0; j < i-1; j++) {
				this.array[j] = base;
			}
		} else {
			let newSep = new Separator(this.separators[i].toString(),this);
			this.array[i+1]--;
			this.separators.splice(i,0,newSep);
			this.array.splice(i+1,0,2);
			this.separators[i].solve(this.base,this.iterator);
		}
	}
}

function solve() {
	let array = document.getElementById("input").innerHTML;
	if(typeof array === "string") {
		array = new SanArray(array);
		array = array.solve();
		document.getElementById("input").innerHTML = array.toString();
	} else {
		document.getElementById("input").innerHTML = array;
	}
}
