new class App {
    constructor() {
        this.sidebarContainer = document.querySelector(".w2g-menu-tab.w2g-playlists.w2g-active");
        this.dropdownContainer = document.querySelector(".w2g-dropdown.w2g-down-right.w2g-users");
        this.channelName = this.getChannelName();
        this.remoteHost = "w2g.tv";
        this.createDropdownButton();
        this.initialize();
    }

    initialize() {
        if(this.channelName == null)
            return this.createInputWindow();
        this.createEmbedStream();
        this.createEmbedChat();
    }

    createDropdownButton() {
        this.dropdownButton = document.createElement("button");
        this.dropdownButton.classList.add("dropdownButton");
        this.dropdownButton.textContent = "Reset twitch channel";

        this.dropdownContainer.appendChild(this.dropdownButton);
        this.createResetListener();
    }

    createResetListener() {
        this.dropdownButton.addEventListener("click", () => {
            window.localStorage.removeItem(this.getRoomName());
            this.channelName = this.getChannelName();
            if(this.streamIframe && this.chatIframe) {
                this.streamIframe.remove();
                this.chatIframe.remove();
            }
            if(this.inputWindowContainer) {
                this.inputWindowContainer.remove();
            }
            this.initialize();
        });
    }

    createInputWindow() {
        this.inputWindowContainer = document.createElement("div");
        this.inputWindow = document.createElement("div");
        this.inputText = document.createElement("div");
        this.inputElement = document.createElement("input");
        this.inputButton = document.createElement("button");

        this.inputWindowContainer.classList.add("inputWindowContainer");
        this.inputWindow.classList.add("inputWindow");
        this.inputText.classList.add("inputText");
        this.inputElement.classList.add("inputElement");
        this.inputButton.classList.add("inputButton");

        this.inputText.textContent = "Set the name of the twitch channel you want to link to the room.";
        this.inputElement.placeholder = "e.g. resttpowered";
        this.inputButton.textContent = "Update";

        this.sidebarContainer.appendChild(this.inputWindowContainer);
        this.inputWindowContainer.appendChild(this.inputWindow);
        this.inputWindow.appendChild(this.inputText);
        this.inputWindow.appendChild(this.inputElement);
        this.inputWindow.appendChild(this.inputButton);

        this.createChangeListener();
    }

    createChangeListener() {
        this.inputButton.addEventListener("click", () => {
            if(this.inputElement.value.length > 0) {
                window.localStorage.setItem(this.getRoomName(), this.inputElement.value);
                this.channelName = this.getChannelName();
                this.inputWindowContainer.remove();
                this.initialize();
                return;
            }
            this.inputElement.classList.add("danger");
        });
    }

    createEmbedStream() {
        this.streamIframe = document.createElement("iframe");
        this.streamIframe.classList.add("streamIframe");
        this.streamIframe.setAttribute('src', `https://player.twitch.tv/?channel=${this.channelName}&parent=${this.remoteHost}&muted=false`);
        this.streamIframe.setAttribute('width', '100%');
        this.streamIframe.setAttribute('allowfullscreen', 'false');
        this.sidebarContainer.appendChild(this.streamIframe);
    }

    createEmbedChat() {
        this.chatIframe = document.createElement("iframe");
        this.chatIframe.classList.add("chatIframe");
        this.chatIframe.setAttribute('src', `https://www.twitch.tv/embed/${this.channelName}/chat?parent=${this.remoteHost}&darkpopout`);
        this.chatIframe.setAttribute('width', '100%');
        this.chatIframe.setAttribute('height', '100%');
        this.sidebarContainer.appendChild(this.chatIframe);
    }

    getRoomName() {
        return window.location.pathname.replace("/rooms/", "");
    }

    getChannelName() {
        return window.localStorage.getItem(this.getRoomName());
    }
}();