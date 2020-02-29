## Translate Extension
### Introduction
 
This extension open a bubble that can you click on when you select a text on the page and show a iframe of the google translate in your browser page. It is similar to the google translate extension.

### How to use
#### Changing the default language
First you should change the default language settings by accessing to about:addons > Translate Extension option page.

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