const electron=require('electron');
const url=require('url');
const path=require('path');

const {app,BrowserWindow,Menu,ipcMain}=electron;

process.env.NODE_ENV='production';

let mainWindow;
let newWindow;

app.on('ready',function(){
    mainWindow=new BrowserWindow({
        webPreferences: {
            nodeIntegration: true
        }
    });
    //  the below url is file://dirname/mainWindow.html
    mainWindow.loadURL(url.format({
        pathname:path.join(__dirname,'mainWindow.html'),
        protocol:'file:',
        slashes:true
    }));

    mainWindow.on('closed',function(){
        app.quit();
    })

    const mainMenu=Menu.buildFromTemplate(mainMenuTemplate);
    Menu.setApplicationMenu(mainMenu)
});

function createAddWindow(){
    newWindow=new BrowserWindow({
        width:300,
        height:200,
        title:'Add Shopping List Item',
        webPreferences: {
            nodeIntegration: true
        }
    });
    newWindow.loadURL(url.format({
    pathname:path.join(__dirname,'newWindow.html'),
    protocol:'file:',
    slashes:true    
    }));

    newWindow.on('close', function(){
        newWindow = null;
      });
}

ipcMain.on('item:add',function(e,item){
    console.log(item);
    mainWindow.webContents.send('item:add',item);
    newWindow.close();
});

const mainMenuTemplate=[
    {
        label:'File',
        submenu:[
            {
                label:'Add Item',
                click(){
                    createAddWindow();
                }
            },
            {
                label:'Clear Items',
                click(){
                    mainWindow.webContents.send('item:clear');
                }
            },
            {
                label:'Quit',
                accelerator:process.platform== 'darwin' ? 'Command+Q': 'Ctrl+Q',
                click(){
                    app.quit();
                }
            }
        ]
    }
] 

if(process.platform=='darwin'){
    mainMenuTemplate.unshift({});
}

if(process.env.NODE_ENV !=='production'){
    mainMenuTemplate.push({
        label:'Developer Tools',
        submenu:[
        {
            label:'Toggle DevTools',
            accelerator:process.platform== 'darwin' ? 'Command+I': 'Ctrl+I',
            click(item,focusedWindow){
                focusedWindow.toggleDevTools();
            },
        },
        {
            role:'reload'
        }
    ]
    });
}
