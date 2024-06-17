# jQuery.ListaDeCompras

jQuery plugin of the Lista de Compras platform

[![Build status](https://ci.appveyor.com/api/projects/status/349rs8y8rk7vqnjw/branch/main?svg=true)](https://ci.appveyor.com/project/guibranco/jquery-listadecompras/branch/main)
[![wakatime](https://wakatime.com/badge/github/InovacaoMediaBrasil/jQuery.ListaDeCompras.svg)](https://wakatime.com/badge/github/InovacaoMediaBrasil/jQuery.ListaDeCompras)
[![GitHub license](https://img.shields.io/github/license/InovacaoMediaBrasil/jQuery.ListaDeCompras)](https://github.com/InovacaoMediaBrasil/jQuery.ListaDeCompras)
[![GitHub last commit](https://img.shields.io/github/last-commit/InovacaoMediaBrasil/jQuery.ListaDeCompras/main)](https://github.com/InovacaoMediaBrasil/jQuery.ListaDeCompras)
[![Maintainability](https://api.codeclimate.com/v1/badges/55e52654e1280711eea8/maintainability)](https://codeclimate.com/github/InovacaoMediaBrasil/jQuery.ListaDeCompras/maintainability)
[![Test Coverage](https://api.codeclimate.com/v1/badges/55e52654e1280711eea8/test_coverage)](https://codeclimate.com/github/InovacaoMediaBrasil/jQuery.ListaDeCompras/test_coverage)
[![CodeFactor](https://www.codefactor.io/repository/github/InovacaoMediaBrasil/jQuery.ListaDeCompras/badge)](https://www.codefactor.io/repository/github/InovacaoMediaBrasil/jQuery.ListaDeCompras)

![jquery.ListaDeCompras logo](https://raw.githubusercontent.com/InovacaoMediaBrasil/jQuery.ListaDeCompras/main/logo.png)

## NPM - Node Package Manager

[![npm](https://img.shields.io/npm/v/jquerylistadecompras)](https://www.npmjs.com/package/jquerylistadecompras)
[![npm](https://img.shields.io/npm/dy/jquerylistadecompras)](https://www.npmjs.com/package/jquerylistadecompras)

Este repositório está disponível no NPM com o nome [jquerylistadecompras](https://www.npmjs.com/package/jquerylistadecompras).

```bash

npm i jquerylistadecompras

```

## NuGet - Package Manager for .NET

[![jquery.listadecompras NuGet Version](https://img.shields.io/nuget/v/jquery.listadecompras.svg?style=flat)](https://www.nuget.org/packages/jquery.listadecompras/)
[![jquery.listadecompras NuGet Downloads](https://img.shields.io/nuget/dt/jquery.listadecompras.svg?style=flat)](https://www.nuget.org/packages/jquery.listadecompras/)


```bash

dotnet add package jquery.listadecompras

```

---

[![Github All Releases](https://img.shields.io/github/downloads/InovacaoMediaBrasil/jQuery.ListaDeCompras/total.svg?style=plastic)](https://github.com/InovacaoMediaBrasil/jQuery.ListaDeCompras)

Lista de Compras (Editora Inovação) is a application that allows you create a list of available products selling in Vitrine do Artesanto or Tania Silva store and show it on any website with a link to the cart of the store.

With this plugin you can manage your lists, [TODO] account preferences and get the available products for building new lists.

[Lista de Compras platform](https://listadecompras.editorainovacao.com.br) 

[Lista de Compras API documentation](http://ti.editorainovacao.com.br/Docs/ListaDeCompras/API.pdf)

[Lista de Compras .NET SDK](http://ti.editorainovacao.com.br/Docs/ListaDeCompras/SDK/)

The plugin working on Programa Arte Brasil:

![Lista de Compras no Programa Arte Brasil](https://raw.githubusercontent.com/InovacaoMediaBrasil/jQuery.ListaDeCompras/main/ListaDeCompras-ProgramaArteBrasil.PNG)

And in the Canal do Artesanato:

![Lista de Compras no Canal do Artesanato](https://raw.githubusercontent.com/InovacaoMediaBrasil/jQuery.ListaDeCompras/main/ListaDeCompras-CanalDoArtesanato.PNG)

----------

## Usage ##

To simple show a list in your page, creates a simple HTML element and call the plugin:

```html
<div id="showListaDeCompras"></div>
```
Now call the plugin:
```js
var listaDeCompras = $("#showListaDeCompras").listaDeCompras({
	readKey : "your-read-key",
	listId : 1, //The list ID
	theme: "oliveDrab" //The list theme (availables: red, orange, green, blue, oliveDrab and default)
	});
```
----------

## Options ##

You can pass options by the constructor or by the *options* method (see * Methods * above for more info)

| Option  | Description  | Default value | Values |
|:-:|:-:|:-:|:-:|
| useProduction | Sets the platform environment  | **true** | **boolean**:true\|false |
| readKey  | The platform API key | **null** | **string**:your api key |
 | type | The display type (use table or ul/li elements) | **table** | **string**:table\|list |
 | showPrices | Flag to show products prices or not | **true** | **boolean**:true\|false |
| listLoadSuccesfullyCallback | A callback function to trigger when the lists load succesfully | **null** | **function** |
| listLoadErrorCallback | A callback function to trigger when cannot load the list (error \| list dosen't exists) | **null** | **function** |
| debug | A flag to enable or disable debugging | **false** | **boolean**:true\|false |
| maxProducts | Limit the maximum number of products displayed in the list | **-1** | **integer**: -1 show all \| N shows N |
| theme | The plugin CSS theme | **default** | **string**: red, orange, blue, green, oliveDrab, default |
| customCampaign | The utm_campaign string for the buy link | **null** | **string** |
 | headerText | The plugin header text | **null** | **string** |
 | css | This option allows you set custom CSS classes for some items of the plugin | ** default plugin classes ** | **object**: see table below |

** The CSS classes ** can be overrrinding by setting the CSS option with the following object:

| Property | Description | Default value |
|:-:|:-:|:-:|:-:|
| itemQuantity | The item quantity field | **quantity** |
| itemQuantityPlus | The item quantity increase button | **plus** |
| itemQuantityLess | The item quantity decrease button | **less** | 
| itemAvailability | The item availability class to enable\|disable the quantity field & buttons | **availability** |
| itemAvailabilityIcon | The item availability icon | **stockIcon** |
| buyButton | The buy button | **buy** |
| cartTotal | The cart total descriptor | **amount** |


----------

## Methods ##

There are a few methods that can be called to operate the plugin programmatically

**init**: Initializes the plugin
```js
$("#target").listaDeCompras("init");
```

**destroy**: Destroys the plugin (the list itself is also removed from the page)
```js
$("#target").listaDeCompras("destroy");
```
**load**: Loads a specific list by it's id
```js
$("#target").listaDeCompras("load", 1234); //try to load the list 1234
```

**updateQuantity**: Updates the selected quantity for a specified SKU in the list
```js
$("#target").listaDeCompras("updateQuantity", 1, 10); //updates the quantity of SKU 1 to 10 units
```

**addToCart**: adds a sku to the cart, this is the same of adding 1 item of the product
```js
$("#target").listaDeCompras("addToCart", new { SalesChannelId: 1000001, Stock: 10, Quantity: 1, Price: 10.9});//You should pass the sales channel id, available quantity, desired quantity and the price of the SKU
```
**clearCart**: Removes all products from the cart
```js
$("#target").listaDeCompras("clearCart");
```

**addEventListeners**: Add event listeners to the plugin increase & decrease buttons, quantity fields and buy button
```js
$("#target").listaDeCompras("addEventListeners");
```

**getBuyLink**: Gets the link to the store cart (with all sku & quantity) selecteds and the SEO params
```js
var link = $("#target").listaDeCompras("getBuyLink");
window.open(link);
```

**getCartTotal**: Gets the current cart total
```js
var total = $("#target").listaDeCompras("getCartTotal");
window.alert("Current cart is R$ " + total);
```

**updateCartTotal**: Updates the cart total (only if **showPrices** option is set to true), usefull when you add products or change the quantity of a product via JS
```js
$("#target").listaDeCompras("updateCartTotal");
```

**set**: Sets an option after the plugin has been initialized
```js
$("#target").listaDeCompras("set", "optionName", "optionValue");
```

**get**: Gets the current value for a option
```js
$("#target").listaDeCompras("get","optionName");
```

**debug**: Debugs the current plugin to the console.log
```js
$("#target").listaDeCompras("debug");
```
---

Developed by [Guilherme Branco Stracini](https://www.guilhermebranco.com.br) for [Editora Inovação](https://www.editorainovacao.com.br) 

© 2016 ~ 2018 All rights reserved.

---
