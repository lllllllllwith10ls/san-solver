class SanArray {
	constructor(str,parent) {
		this.array = [];
		this.separators = [];
		let subArray = false;
		let parentheses = 0;
		let separator = false;
		let marker = 0;
		this.layer = 0;
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
				if(str[i] === ",") {
					str = str.replace(",","c");
				}if(str[i] === "{") {
					str = str.replace("{","b");
				}
				if(str[i] === "}") {
					str = str.replace("}","d");
				}
				if(str[i] === "`") {
					str = str.replace("`","g");
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
		str = str.replace(/c/g,",");
		str = str.replace(/b/g,"{");
		str = str.replace(/d/g,"}");
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
		while(this.array[this.array.length-1] === 1 && this.array.length > 0) {
			this.array.pop();
			this.separators.pop();
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
			this.iterator = this.iterator.solve();
		} else if(this.array.length === 0) {
			return this.base**this.iterator;	
		} else if(this.separators[0].array[0] === 1 && this.separators[0].array.length === 1 && this.array[0] > 1 && this.iterator > 1) {
			let it = new SanArray(this.toString(),this);
			it.iterator--;
			this.iterator = it;
			this.array[0]--;
		} else {
			let i = 0;
			while(this.array[i] <= 1) {
				i++;
			}
			if(this.array[i] instanceof SanArray) {
				this.array[i] = this.array[i].solve();
			} else if(this.separators[i].array.length === 1 && this.separators[i].array[0] === 1) {
				this.array[i]--;
				this.array[i-1] = this.iterator;
				for(let j = 0; j < i-1; j++) {
					this.array[j] = this.base;
				}
				this.iterator = this.base;
			} else {
				let newSep = new Separator(this.separators[i].toString(),this);
				this.array[i]--;
				this.separators.splice(i,0,newSep);
				this.array.splice(i,0,2);
				this.separators[i].solve(this.base,this.iterator);
			}
		}
		this.clean();
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
let dummyArray = new SanArray("s(3,3)");
class Separator {
	constructor(str,parent) {
		this.array = [];
		this.separators = [];
		let subArray = false;
		let parentheses = 0;
		let separator = false;
		let marker = 0;
		this.parent = parent;
		this.ga = 0;
		this.layer = parent.layer+1;
		this.solving = false;
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
				if(str[i] === ",") {
					str = str.replace(",","c");
				}if(str[i] === "{") {
					str = str.replace("{","b");
				}
				if(str[i] === "}") {
					str = str.replace("}","d");
				}
				if(str[i] === "`") {
					str = str.replace("`","g");
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
				if(str[i] === "`") {
					let j = i;
					let ga = 0;
					while (str[j] === "`") {
						ga++;
						j++;
					}
					
					str = str.replace("`".repeat(ga)," ");
					this.separators.push(new Separator("{1^"+"`".repeat(ga)+"}",this));
				}
				if(str[i] === "^") {
					break;
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
		str = str.replace(/c/g,",");
		str = str.replace(/b/g,"{");
		str = str.replace(/d/g,"}");
		str = str.replace(/g/g,"`");
		
		if(str[str.length-1] === "`") {
			let i = str.length-1;
			while(str[i] !== "^") {
				i--;
				this.ga++;
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
		let str;
		if(this.array.length === 1 && this.array[0] === 1) {
			if(this.ga === 0) {
				str = ",";
			} else {
				str = "`".repeat(this.ga);
			}
		} else {
			str = "{";
			for(let i = 0; i < this.array.length; i++) {
				if(this.array[i]) {
					str+=this.array[i]+"";
				}
				if(this.separators[i]) {
					str+=this.separators[i].toString();
				}
			}
			if(this.ga > 0) {
				str += "^"+"`".repeat(this.ga);
			}
			str += "}";
		}
		if(this.solving) {
			return "**"+str+"**";
		} else {
			return str;
		}
	}
	clean() {
		while(this.array[this.array.length-1] === 1 && this.array.length > 1) {
			this.array.pop();
			this.separators.pop();
		}
		for(let i = this.separators.length-1; i >= 1; i--) {
			while(this.array[i] <= 1 && this.array[i+1] > 1 && Separator.level(this.separators[i],this.separators[i-1]) === this.separators[i]) {
				this.array.splice(i,1);
				this.separators.splice(i-1,1);
				i--;
			}
		}
		for(let i = 0; i < this.separators.length; i++) {
			this.separators[i].clean();
		}
	}
	static level(a,b) {
		if(a.ga > b.ga) {
			return a;
		} else if(a.ga < b.ga) {
			return b;
		} else if(a.array.length > 1 && b.array.length === 1) {
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
			for(let i = 1; i < a.separators.length; i++) {
				if(Separator.level(a.separators[ma[0]],a.separators[i]) === a.array[i]) {
					ma = [i];
				} else if(Separator.level(a.separators[ma[0]],a.separators[i]) === "equal") {
					ma.push(i);
				}
			}
			let mb = [0];
			for(let i = 1; i < b.separators.length; i++) {
				if(Separator.level(b.separators[mb[0]],b.separators[i]) === b.array[i]) {
					mb = [i];
				} else if(Separator.level(b.separators[mb[0]],b.separators[i]) === "equal") {
					mb.push(i);
				}
			}
			if(Separator.level(a.separators[ma[0]],b.separators[mb[0]]) === a.separators[ma[0]]) {
				return a;
			} else if(Separator.level(a.separators[ma[0]],b.separators[mb[0]]) === b.separators[ma[0]]) {
				return b;
			} else if(ma.length > mb.length) {
				return a;
			} else if(ma.length < mb.length) {
				return b;
			} else {
				let part1 = new Separator(a.toString(),dummyArray);
				let part2 = new Separator(a.toString(),dummyArray);
				part1.array = part1.array.slice(0,ma[0]+1);
				part2.array = part2.array.slice(ma[0]+1);
				part1.separators = part1.separators.slice(0,ma[0]);
				part2.separators = part2.separators.slice(ma[0]+1);
				
				let part3 = new Separator(b.toString(),dummyArray);
				let part4 = new Separator(b.toString(),dummyArray);
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
			this.array[i] = this.array[i].solve();
		} else if(i === 0) {
			let index = this.parent.separators.indexOf(this);
			let reduced = new Separator(this.toString(),this.parent);
			reduced.array[0]--;
			let seps = [];
			let ones = [];
			
			for(let j = 0; j < iterator; j++) {
				seps.push(new Separator(reduced.toString,this.parent));
				ones.push(1);
			}
			ones.pop();
			if(this.parent instanceof SanArray) {
				this.parent.separators.splice(index,1,...seps);
				this.parent.array.splice(index,0,...ones);
			} else {
				this.parent.separators.splice(index,1,...seps);
				this.parent.array.splice(index,0,...ones);
			}
		} else if(this.separators[i-1].array.length === 1 && this.separators[i-1].array[0] === 1) {
			if(this.separators[i-1].ga > 0) {
				let newSep = new Separator("{1^"+this.separators[i-1].toString()+"}",this);
				this.array[i]--;
				this.separators.splice(i-1,0,newSep);
				this.array.splice(i,0,2);
				let m = this.separators[i-1];
				let t = this.layer;
				let a = this;
				let a1 = m;
				while(a.ga >= m.ga) {
					a1 = a;
					a = a.parent;
					t--;
				}
				if(a.ga === m.ga-1) {
					m.solving = true;
					let a_t = a.toString();
					a_t = a_t.split(m.toString());
					let p = a_t[0];
					let q = a_t[1];
					Object.assign(a,new Separator(p.repeat(iterator-1)+","+q.repeat(iterator-1),a.parent));
				} else {
					a1.solving = true;
					let a_t = a.toString();
					a_t = a_t.split(a1.toString());
					let p = a_t[0];
					let q = a_t[1];
					a1.solving = false;
					Object.assign(a,new Separator(p+"{1"+a1.toString()+"2"+"`".repeat(m.ga-1)+"}"+q));
				}
			} else {
				this.array[i]--;
				this.array[i-1] = iterator;
				for(let j = 0; j < i-1; j++) {
					this.array[j] = base;
				}
			}
		} else {
			let newSep = new Separator(this.separators[i-1].toString(),this);
			this.array[i]--;
			this.separators.splice(i-1,0,newSep);
			this.array.splice(i,0,2);
			this.separators[i-1].solve(base,iterator);
		}
		this.clean();
	}
}

function solve() {
	let array = document.getElementById("input").value;
	array = new SanArray(array);
	array = array.solve();
	document.getElementById("input").value = array.toString();

}
