class PGroup {
  #members;
  constructor(members) {
    this.#members = members;
  }

  add(value) {
    if (this.has(value)) return this;
    return new PGroup(this.#members.concat([value]));
  }

  delete(value) {
    if (!this.has(value)) return this;
    return new PGroup(this.#members.filter(m => m !== value));
  }

  has(value) {
    return this.#members.includes(value);
  }

  static empty = new PGroup([]);
}

let a = PGroup.empty.add("a");
let ab = a.add("b");
let b = ab.delete("a");

console.log(b.has("b"));
// → true
console.log(a.has("b"));
// → false
console.log(b.has("a"));
// → false
