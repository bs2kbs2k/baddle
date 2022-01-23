import { PersistantStorage } from "./storage";

class Config {
    hardMode: boolean = false;
    _colorblindMode: boolean = false;
    _darkMode: boolean = true;
    public serialize(): string {
        return JSON.stringify(this);
    }
    public deserialize(data: string) {
        const json = JSON.parse(data);
        this.hardMode = json.hardMode;
        this.colorblindMode = json._colorblindMode;
        this.darkMode = json._darkMode;
    }
    set colorblindMode(value: boolean) {
        this._colorblindMode = value;
        if (value) {
            document.querySelector("body").classList.add("colorblind");
        } else {
            document.querySelector("body").classList.remove("colorblind");
        }
    }
    get colorblindMode(): boolean {
        return this._colorblindMode;
    }
    set darkMode(value: boolean) {
        this._darkMode = value;
        if (value) {
            document.querySelector("body").classList.add("nightmode");
        } else {
            document.querySelector("body").classList.remove("nightmode");
        }
    }
    get darkMode(): boolean {
        return this._darkMode;
    }
}

window["gameSettings"] = new PersistantStorage("gameSettings", new Config());

document.querySelector("#settings").addEventListener("click", () => {
    const overlay = document.querySelector("#overlay");
    const overlay_inner = overlay.children[0];
    const settings_template = document.querySelector("#settings-content") as HTMLTemplateElement;
    overlay_inner.querySelector(".title").textContent = "settings";
    overlay_inner.querySelector("#overlay-content").appendChild(settings_template.content.cloneNode(true));
    overlay.classList.remove("hidden");
    overlay_inner.classList.add("slide-in");
    const darkTheme = document.querySelector("#dark-theme") as HTMLInputElement;
    darkTheme.checked = window["gameSettings"].content.darkMode;
    darkTheme.addEventListener("input", (e) => {
        const darkTheme = e.target as HTMLInputElement;
        window["gameSettings"].content.darkMode = darkTheme.checked;
    });
    const colorblindMode = document.querySelector("#colorblind-mode") as HTMLInputElement;
    colorblindMode.checked = window["gameSettings"].content.colorblindMode;
    colorblindMode.addEventListener("input", (e) => {
        const colorblindMode = e.target as HTMLInputElement;
        window["gameSettings"].content.colorblindMode = colorblindMode.checked;
    });
    const hardMode = document.querySelector("#hard-mode") as HTMLInputElement;
    hardMode.checked = window["gameSettings"].content.hardMode;
    hardMode.addEventListener("input", (e) => {
        const hardMode = e.target as HTMLInputElement;
        window["gameSettings"].content.hardMode = hardMode.checked;
    });
});