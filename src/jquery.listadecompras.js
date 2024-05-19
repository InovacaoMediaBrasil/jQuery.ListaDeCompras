/*
 *  Project: Lista de Compras
 *  Description: Get a buy list based on a index and a client key in the Lista de Compras platform
 *  Author: Guilherme Branco Stracini
 *  License:
 */
// the semi-colon before function invocation is a safety net against concatenated
// scripts and/or other plugins which may not be closed properly.

(function ($, window, document, undefined) {
  // undefined is used here as the undefined global variable in ECMAScript 3 is
  // mutable (ie. it can be changed by someone else). undefined isn't really being
  // passed in so we can ensure the value of it is truly undefined. In ES5, undefined
  // can no longer be modified.

  // window is passed through as local variable rather than global
  // as this (slightly) quickens the resolution process and can be more efficiently
  // minified (especially when both are regularly referenced in your plugin).

  const pluginName = "listaDeCompras";
  const pluginVersion = 2.1;
  const dataPlugin = "plugin_" + pluginName;
  const productionEndPoint =
    "https://api.listadecompras.editorainovacao.com.br/List/";
  const homologationEndPoint =
    "https://api.listadecomprastest.editorainovacao.com.br/List/";
  const defaults = {
    useProduction: true,
    readKey: null,
    type: "table",
    showPrices: true,
    listLoadSuccessfullyCallback: null,
    listLoadErrorCallback: null,
    debug: false,
    maxProducts: -1,
    theme: "default",
    customCampaign: null,
    headerText: null,
    css: {
      itemQuantity: "quantity",
      itemQuantityPlus: "plus",
      itemQuantityLess: "less",
      itemAvailability: "availability",
      itemAvailabilityIcon: "stockIcon",
      buyButton: "buy",
      cartTotal: "amount",
    },
  };

  function debug(message, lc) {
    if (!lc.options.debug) {
      return;
    }
    if (typeof message === "string") {
      console.log(message);
    } else if (typeof message === "object") {
      console.log(JSON.stringify(message));
    }
  }

  function processList(lc) {
    let footer;
    const data = lc.privateData.list;
    const id = pluginName + "_l_" + data.ListId + "_s_" + data.StoreId;
    let listLength = data.Products.length;
    if (lc.options.maxProducts != -1) {
      listLength =
        listLength > lc.options.maxProducts
          ? lc.options.maxProducts
          : listLength;
    }
    lc.element.empty();
    switch (lc.options.type) {
      case "table":
        var table = $(
          "<table id='" +
            id +
            "' width='100%' border='0' cellspacing='0' cellpadding='0'></table>",
        );
        lc.element.append(table);
        var thead = $(
          "<thead>" +
            (lc.options.headerText != null
              ? "<tr class='header'><th colspan='" +
                (lc.options.showPrices ? 5 : 4) +
                "'>" +
                lc.options.headerText +
                "</th></tr>"
              : "") +
            "<tr><th width='100'>&nbsp;</th><th>Produto</th>" +
            (lc.options.showPrices ? "<th>Preço</th>" : "") +
            "<th></th><th>Quant.</th></tr></thead>",
        );
        table.append(thead);
        var tbody = $("<tbody></tbody>");
        table.append(tbody);
        for (var i = 0; i < listLength; i++) {
          var product = data.Products[i];
          if (product.Stock > 0) {
            addToCart(product, lc);
          }
          const tr = $("<tr>");
          tbody.append(tr);

          const tdPhoto = $("<td>");
          tr.append(tdPhoto);
          tdPhoto.append(
            $("<img />")
              .prop("src", product.PhotoUrl)
              .prop("alt", "Foto do produto " + product.Name),
          );

          const tdName = $("<td>");
          tr.append(tdName);
          tdName.append(
            $("<h6>").text(product.Name + " " + product.Complement),
          );

          if (lc.options.showPrices) {
            const tdPrice = $("<td>");
            tr.append(tdPrice);
            tdPrice.append(
              $("<span>").text(product.Price.toFixed(2).replace(".", ",")),
            );
          }

          const tdAvailability = $("<td>");
          tr.append(tdAvailability);
          tdAvailability.append(
            $("<input />")
              .addClass(lc.options.css.itemAvailability)
              .prop("type", "checkbox")
              .prop(
                "name",
                lc.options.css.itemAvailability +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .val(product.Stock > 0 ? 1 : 0),
          );
          tdAvailability.append(
            $("<label>").addClass(lc.options.css.itemAvailabilityIcon),
          );

          const tdCart = $("<td>");
          tr.append(tdCart);

          var divCart = $("<div>").addClass("cart");
          tdCart.append(divCart);
          divCart.append(
            $("<input />")
              .prop("type", "text")
              .prop(
                "id",
                lc.options.css.itemQuantity +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .prop(
                "name",
                lc.options.css.itemQuantity +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .addClass(lc.options.css.itemQuantity)
              .val(product.Stock > 0 ? product.Quantity : ""),
          );
          divCart.append(
            $("<button />")
              .prop("type", "button")
              .addClass(
                lc.options.css.itemQuantity +
                  " " +
                  lc.options.css.itemQuantityPlus,
              )
              .text("+"),
          );
          divCart.append(
            $("<button />")
              .prop("type", "button")
              .addClass(
                lc.options.css.itemQuantity +
                  " " +
                  lc.options.css.itemQuantityLess,
              )
              .text("-"),
          );
        }

        var tfoot = $("<tfoot>");
        table.append(tfoot);

        var trFoot = $("<tr>");
        tfoot.append(trFoot);

        var tdInstructionsFoot = $("<td>").prop("colspan", 2);
        trFoot.append(tdInstructionsFoot);
        tdInstructionsFoot.append(
          $("<p>").text(
            'Selecione os produtos que deseja na Lista de Compras e clique em "Comprar" para ir até o carrinho.',
          ),
        );

        footer = $("<td>").prop("colspan", 3);
        trFoot.append(footer);
        break;

      case "list":
        if (lc.options.headerText != null) {
          lc.element.append($("<div>").addClass("header").html(headerText));
        }
        var ul = $("<ul id='" + id + "></ul>");
        lc.element.append(ul);
        for (var i = 0; i < listLength; i++) {
          var product = data.Products[i];
          if (product.Stock > 0) {
            addToCart(product, lc);
          }

          const li = $("<li>");
          ul.append(li);

          const divPhoto = $("<div>").addClass("photo");
          li.append(divPhoto);
          divPhoto.append(
            $("<img />")
              .prop("src", product.PhotoUrl)
              .prop("alt", "Foto do produto " + productName),
          );

          li.append($("<span>").text(product.Name + " " + product.Complement));

          if (lc.options.showPrices) {
            const divPrice = $("<div>");
            li.append(divPrice);
            liPrice.append(
              $("<span>").text(product.Price.toFixed(2).replace(".", ",")),
            );
          }

          const divStock = $("<div>");
          li.append(divStock);
          divStock.append(
            $("<input />")
              .prop("type", "checkbox")
              .addClass(lc.options.css.itemAvaiability)
              .prop(
                "name",
                lc.options.css.itemAvaiability +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .val(product.Stock > 0 ? 1 : 0),
          );
          divStock.append(
            $("<label>").addClass(lc.options.css.itemAvailabilityIcon),
          );

          var divCart = $("<div>").addClass("cart");
          li.append(divCart);
          divCart.append(
            $("<input />")
              .prop("type", "text")
              .prop(
                "id",
                lc.options.css.itemQuantity +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .prop(
                "name",
                lc.options.css.itemQuantity +
                  "_l_" +
                  data.ListId +
                  "_p_" +
                  product.SalesChannelId,
              )
              .addClass(lc.options.css.itemQuantity)
              .val(product.Stock > 0 ? product.Quantity : ""),
          );
          divCart.append(
            $("<button />")
              .prop("type", "button")
              .addClass(
                lc.options.css.itemQuantity +
                  " " +
                  lc.options.css.itemQuantityPlus,
              )
              .text("+"),
          );
          divCart.append(
            $("<button />")
              .prop("type", "button")
              .addClass(
                lc.options.css.itemQuantity +
                  " " +
                  lc.options.css.itemQuantityLess,
              )
              .text("-"),
          );
        }

        footer = $("<li>");
        ul.append(footer);
        break;

      default:
        throw (
          lc.options.type +
          " is not a valid display mode for jQUery." +
          pluginName +
          " plugin"
        );
    }
    const divAmount = $("<div>").addClass(lc.options.css.cartTotal);
    footer.append(divAmount);
    if (lc.options.showPrices) {
      divAmount.append($("<span>").html("Total: <b>R$<font>0,00</font></b>"));
    }
    divAmount.append(
      $("<div>").addClass(lc.options.css.buyButton).text("Comprar"),
    );

    $(lc.element)
      .find("input." + lc.options.css.itemAvailability + "[value=0]")
      .parents(lc.options.type === "table" ? "tr" : "li")
      .find("." + lc.options.css.itemQuantity)
      .prop("disabled", true);
    updateCartTotal(lc);
  }

  function onBuyClick(lc) {
    debug("Buy button clicked", lc);
    window.open(lc.privateData.buyLink);
  }

  function onLoadList(data, lc) {
    if (typeof data === "undefined") {
      return;
    }
    debug(
      "List #" +
        data.ListId +
        " loaded sucesfully with " +
        data.Products.length +
        " products! Showing in " +
        lc.options.type +
        " format with" +
        (lc.options.showPrices ? "" : "out") +
        " prices",
      lc,
    );
    lc.privateData.storeId = data.StoreId;
    lc.privateData.storeUrl = data.StoreUrl;
    lc.privateData.clientMedium = data.ClientMedium;
    lc.privateData.clientCampaign =
      lc.options.customCampaign == null
        ? data.ListId
        : lc.options.customCampaign;
    lc.privateData.list = data;
    clearCart(lc);
    if (
      lc.options.listLoadSuccessfullyCallback != null &&
      typeof lc.options.listLoadSuccessfullyCallback === "function"
    ) {
      return lc.options.listLoadSuccessfullyCallback(data, lc);
    }
    processList(lc);
    addEventListeners(lc);
  }

  function onLoadError(x, t, e, lc) {
    if (
      lc.options.listLoadErrorCallback != null &&
      typeof lc.options.listLoadErrorCallback === "function"
    ) {
      return lc.options.listLoadErrorCallback(x, t, e, lc);
    }
    if (x.status == 404) {
      debug("List #" + lc.options.listId + " don't exists!", lc);
      lc.element.data(dataPlugin, null);
      lc.element.remove();
      return;
    }
    debug(
      "A error ocurred when try to load List #" +
        lc.options.listId +
        ". Error Code: " +
        x.status +
        " | Error Message: " +
        e,
      lc,
    );
  }

  function addEventListeners(lc) {
    debug("Addding event listeners on List #" + lc.privateData.list.ListId, lc);
    $(lc.element).on(
      "change",
      "input." + lc.options.css.itemQuantity,
      function () {
        const skuId = $(this)
          .prop("id")
          .replace(
            lc.options.css.itemQuantity +
              "_l_" +
              lc.privateData.list.ListId +
              "_p_",
            "",
          );
        if (isNaN($(this).val())) {
          $(this).val("0");
        }
        updateQuantity(skuId, parseInt($(this).val()), lc);
      },
    );
    $(lc.element).on(
      "click",
      "button." + lc.options.css.itemQuantity,
      function () {
        const input = $(this)
          .parent()
          .find("input." + lc.options.css.itemQuantity);
        const skuId = input
          .prop("id")
          .replace(
            lc.options.css.itemQuantity +
              "_l_" +
              lc.privateData.list.ListId +
              "_p_",
            "",
          );
        let cartQuantity = parseInt(input.val());
        if ($(this).hasClass("plus")) {
          cartQuantity++;
        } else {
          cartQuantity--;
        }
        updateQuantity(skuId, cartQuantity, lc);
      },
    );
    $(lc.element).on("click", "." + lc.options.css.buyButton, function () {
      onBuyClick(lc);
    });
  }

  function removeEventListeners(lc) {
    debug(
      "Removing event listeners on List #" + lc.privateData.list.ListId,
      lc,
    );
    $(lc.element).off("change", "input." + lc.options.css.itemQuantity);
    $(lc.element).off("click", "button." + lc.options.css.itemQuantity);
    $(lc.element).off("click", ".buy" + lc.options.css.buyButton);
  }

  function updateCartTotal(lc) {
    debug(
      "Updating cart total and buy link for List #" +
        lc.privateData.list.ListId,
      lc,
    );
    const linkEnd =
      "utm_source=Lista+de+Compras+[Editora+Inovação]&utm_medium=" +
      encodeURI(lc.privateData.clientMedium) +
      "&utm_campaign=" +
      encodeURI(lc.privateData.clientCampaign);
    let total = 0;
    let complement = "";
    lc.privateData.buyLink = lc.privateData.storeUrl + "/checkout/cart/add?";
    for (let i = 0; i < lc.privateData.cart.length; i++) {
      total += lc.privateData.cart[i].price * lc.privateData.cart[i].quantity;
      if (lc.privateData.cart[i].quantity == 0) {
        continue;
      }
      lc.privateData.buyLink +=
        complement +
        "sku=" +
        lc.privateData.cart[i].skuid +
        "&qty=" +
        lc.privateData.cart[i].quantity +
        "&seller=1";
      complement = "&";
    }
    lc.privateData.buyLink +=
      "&redirect=true&sc=" + lc.privateData.storeId + "&" + linkEnd;
    if (total == 0) {
      lc.privateData.buyLink = lc.privateData.storeUrl + "?" + linkEnd;
    }
    $("." + lc.options.css.cartTotal + " > span > b > font").text(
      total.toFixed(2).toString().replace(".", ","),
    );
    lc.privateData.cartTotal = total;
  }

  function updateQuantity(skuId, quantity, lc) {
    if (quantity < 0) {
      quantity = 0;
    }
    const listId = lc.privateData.list.ListId;
    debug(
      "Updating quantity of SKU " +
        skuId +
        " to " +
        quantity +
        " in List #" +
        listId,
      lc,
    );
    const input = $("#quantity_l_" + listId + "_p_" + skuId);
    if (input.length == 0) {
      debug("SKU with id " + skuId + " was not found in list " + listId, lc);
      return false;
    }
    input.val(quantity);
    const stockIcon = input
      .parents("tr")
      .find("." + lc.options.css.itemAvailabilityIcon);
    if (quantity == 0) {
      stockIcon.addClass("quantityZero");
    } else {
      stockIcon.removeClass("quantityZero");
    }
    let any = false;
    for (let x = 0; x < lc.privateData.cart.length; x++) {
      if (lc.privateData.cart[x].skuid == skuId) {
        if (lc.privateData.cart[x].stock <= 0) {
          debug("SKU " + skuId + " has no available stock!");
        }
        lc.privateData.cart[x].quantity = quantity;
        any = true;
        break;
      }
    }
    updateCartTotal(lc);
    return any;
  }

  function addToCart(product, lc) {
    debug(
      "Adding product " +
        product.SalesChannelId +
        " to cart of List #" +
        lc.privateData.list.ListId,
      lc,
    );
    lc.privateData.cart.push({
      skuid: product.SalesChannelId,
      quantity: product.Stock > 0 ? product.Quantity : 0,
      stock: product.Stock,
      price: product.Price,
    });
  }

  function clearCart(lc) {
    debug("Clearing cart of List #" + lc.privateData.list.ListId, lc);
    lc.privateData.cart = new Array();
  }

  function ListaDeCompras() {
    this.options = $.extend({}, defaults);
    this.privateData = {};
    this.initialized = false;
    this.loaded = false;
  }

  ListaDeCompras.prototype = {
    init: function (options) {
      if (this.initialized) {
        $.error(
          "Plugin " +
            pluginName +
            " are already initialized in the following elements: " +
            this.element.selector,
        );
      }
      debug(
        "Initializing plugin " +
          pluginName +
          "[Version:" +
          pluginVersion +
          "] in the following elements " +
          this.element.selector,
        this,
      );
      $.extend(this.options, options);
      this.initialized = true;
      this.element.addClass(pluginName + " " + this.options.theme + "Theme");
      if (typeof this.options.listId === "number") {
        this.load(this.options.listId);
      }
      return this;
    },
    destroy: function (keepList) {
      if (!this.initialized) {
        $.error(
          "Plugin " +
            pluginName +
            " aren't initialized in the following elements: " +
            this.element.selector,
        );
      }
      debug(
        "Destroying plugin " +
          pluginName +
          " in the following elements: " +
          this.element.selector,
        this,
      );
      if (typeof keepList === "undefined" || !keepList) {
        removeEventListeners(this);
        this.element.empty();
        this.element
          .removeClass(pluginName)
          .removeClass(this.options.theme + "Theme");
      }
      this.initialized = false;
      return true;
    },
    load: function (listId) {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the load method.",
        );
      }
      if (this.options.readKey == null) {
        $.error(
          "Configure your access key before call the load method. Use 'init' method in jQuery." +
            pluginName +
            " to initialize the plugin or the method 'set' to set an option of the plugin.",
        );
      }
      this.options.listId = listId;
      debug(
        "Loading list " +
          listId +
          " in the following elements: " +
          this.element.selector,
        this,
      );
      const self = this;
      $.ajax({
        url:
          (self.options.useProduction
            ? productionEndPoint
            : homologationEndPoint) + listId,
        type: "GET",
        dataType: "json",
        beforeSend: function (xhr) {
          xhr.setRequestHeader(
            "X-LISTADECOMPRAS-READ-KEY",
            self.options.readKey,
          );
        },
        error: function (x, t, e) {
          return onLoadError(x, t, e, self);
        },
        success: function (data) {
          self.loaded = true;
          return onLoadList(data, self);
        },
      });
      return true;
    },
    updateQuantity: function (skuId, quantity) {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the load method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      return updateQuantity(skuId, quantity, this);
    },
    addToCart: function (product) {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the addToCart method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      return addToCart(product, this);
    },
    clearCart: function () {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the clearCart method.",
        );
      }
      return clearCart(this);
    },
    addEventListeners: function () {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the addEventListeners method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      return addEventListeners(this);
    },
    getBuyLink: function () {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the getBuyLink method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      debug("Getting current buy link", this);
      return this.privateData.buyLink;
    },
    getCartTotal: function () {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the getCartTotal method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      return this.privateData.cartTotal;
    },
    updateCartTotal: function () {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the updateCartTotal method.",
        );
      }
      if (!this.loaded) {
        $.error("Load a list before call this method");
      }
      return updateCartTotal(this);
    },
    set: function (option, value) {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the load method.",
        );
      }
      debug("Setting " + option + " with value: " + value, this);
      if (option === "theme") {
        this.element.removeClass(this.options.theme + "Theme");
        this.element.addClass(value + "Theme");
      }
      this.options[option] = value;
      if (this.loaded) {
        processList(this);
      }
      return true;
    },
    get: function (option) {
      if (!this.initialized) {
        $.error(
          "Initialize the plugin " +
            pluginName +
            " before call the load method.",
        );
      }
      debug(
        "Getting " + option + " - Current value: " + this.options[option],
        this,
      );
      return this.options[option];
    },
    debug: function () {
      debug("Debugging plugin", this);
      return console.log(this);
    },
  };

  $.fn[pluginName] = function (arg) {
    let args, instance;
    if (this.length <= 0) {
      $.error(
        "No elements with the selector '" + this.selector + "' was found",
      );
    }
    if (!(this.data(dataPlugin) instanceof ListaDeCompras)) {
      this.data(dataPlugin, new ListaDeCompras());
    }

    instance = this.data(dataPlugin);
    instance.element = this;

    if (
      (typeof arg === "undefined" || typeof arg === "object") &&
      typeof instance.init === "function"
    ) {
      return instance.init(arg);
    } else if (typeof arg === "string" && typeof instance[arg] === "function") {
      args = Array.prototype.slice.call(arguments, 1);
      const returnValue = instance[arg].apply(instance, args);
      if (arg !== "destroy") {
        return returnValue;
      }
      this.removeData(dataPlugin);
      instance = null;
      return returnValue;
    } else {
      $.error(
        "Method " + arg + " does not exist on jQuery." + pluginName + " plugin",
      );
    }
  };
})(jQuery, window, document);
