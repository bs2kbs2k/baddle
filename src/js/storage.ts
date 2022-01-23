export interface serializable {
    serialize(): string;
    deserialize(data: string): void;
}

function hookChange(obj: object, onChange: () => void): object {
    const proxy = new Proxy(obj, {
        set: (target, key, value) => {
            Reflect.set(target, key, value);
            onChange();
            return true;
        },
        get: (target, key) => {
            let value = Reflect.get(target, key);
            if (typeof value == "function") {
                return value.bind(proxy);
            } else if (typeof value == "object") {
                return hookChange(value, onChange);
            }
            return value;
        }
    });
    return proxy;
}

export class PersistantStorage<T extends serializable> {
    id: string;
    _content: T;
    constructor(id: string, default_content: T) {
        this.id = id;
        if (window.localStorage.getItem(id)) {
            default_content.deserialize(window.localStorage.getItem(id));
            this._content = default_content;
        } else {
            this._content = default_content;
            window.localStorage.setItem(id, default_content.serialize());
        }
    }
    set content(content: T) {
        this._content = content;
        window.localStorage.setItem(this.id, content.serialize());
    }
    get content() {
        if (this._content == null) {
            return null;
        }
        return hookChange(this._content, () => {
            window.localStorage.setItem(this.id, this._content.serialize());
        }) as T;
    }
    public destroy() {
        window.localStorage.removeItem(this.id);
        this._content = null;
    }
}