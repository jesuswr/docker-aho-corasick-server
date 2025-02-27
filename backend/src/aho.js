class ACfixed {
    constructor() {
        this.d = [{}];
        this.ord = [];
        this.charMap = new Map();
        this.nextId = 1;
    }

    getCharIndex(c) {
        if (!this.charMap.has(c)) {
            this.charMap.set(c, this.nextId++);
        }
        return this.charMap.get(c);
    }

    add(s, ind) {
        let v = 0;

        for (let i = 0; i < s.length; i++) {
            const c = this.getCharIndex(s[i]);

            if (!this.d[v].to) {
                this.d[v].to = {};
            }

            if (!this.d[v].to[c]) {
                this.d[v].to[c] = this.d.length;
                this.d.push({});
            }

            v = this.d[v].to[c];
        }

        if (!this.d[v].inds) this.d[v].inds = [];
        this.d[v].inds.push(ind);
        this.d[v].leaf = true;
        return v;
    }

    init() {
        this.d[0].link = -1;
        this.d[0].out = -1;
        let q = [0];
        let ind = 0;

        while (q.length > ind) {
            let v = q[ind++];
            this.d[v].counter = 0;
            this.ord.push(v);

            if (!this.d[v].to) {
                this.d[v].to = {};
            }

            for (const c in this.d[v].to) {
                let u = this.d[v].to[c];
                this.d[u].link = this.d[v].link === -1 ? 0 : (this.d[this.d[v].link].to[c] || 0);
                q.push(u);
            }

            if (v) {
                for (const c of this.charMap.values()) {
                    if (!this.d[v].to[c]) {
                        this.d[v].to[c] = this.d[this.d[v].link]?.to?.[c] || 0;
                    }
                }

                if (this.d[this.d[v].link]?.leaf) {
                    this.d[v].out = this.d[v].link;
                } else {
                    this.d[v].out = this.d[this.d[v].link]?.out || -1;
                }
            }
        }
    }

    query(text) {
        let p = 0;
        for (let i = 0; i < text.length; i++) {
            const c = this.getCharIndex(text[i]);
            p = this.d[p].to?.[c] || 0;
            this.d[p].counter++;
        }

        const indToCount = new Map();

        for (let i = this.ord.length - 1; i >= 0; --i) {
            if (this.d[i].link > 0) {
                this.d[this.d[i].link].counter += this.d[i].counter;
            } 
            if (this.d[i].leaf) {
                for (const ind of this.d[i].inds) {
                    indToCount.set(ind, this.d[i].counter);
                }
            }
        }
        return indToCount;
    }
}

module.exports = {
    ACfixed
}
