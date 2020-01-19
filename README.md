## To Google Translate
### Introduction
 
This extension creates a context menu item in the browser, when you click on a menu item, the current page url, link or the previously selected text is sent to Google Translate. You can also setup default language in the option page.

### How to use
#### Changing the default language
First you should change the default language settings by accessing to about:addons > To Google Translate option page.

### Testing out the extension
You can test the extension in Firefox with *web-ext*. *web-ext* can be installed with the Node Package Manager.
```sh
sudo npm install --global web-ext
```
Download the code from Github
```sh
git clone https://github.com/fuatkarakus/translate-extension.git
cd translate-extension
make prepare
```

Run in the root folder extension the command
```sh
web-ext run
```