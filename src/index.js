require("dotenv").config();
const Events = require("events");
const { Application } = require("express");
const { WebhookClient, MessageEmbed } = require("discord.js");

module.exports = class Discord {
    /**
     * 
     * @param {Events} mainEvent 
     * @param {Application} server 
     * @param {{
     *  CategoryModel: CategoryModel,
     *  CustomerModel: CustomerModel,
     *  ImageModel: ImageModel,
     *  InvoiceModel: InvoiceModel,
     *  OrderModel: OrderModel,
     *  ProductModel: ProductModel,
     *  TransactionsModel: TransactionsModel,
     * }} models 
     */
    constructor(mainEvent, server, models) {
        this.mainEvent = mainEvent;
        this.server = server;
        this.models = models;

        this.discord_webhook_url = process.env.DISCORD_WEBHOOK_URL;

        this.mainEvent.on("invoice_paid", invoice => {
            this.sendWebhook("Invoice paid", {
                text: `Invoice ${invoice.id} has been paid.`,
            })
        });

        this.mainEvent.on("invoice_created", invoice => {
            this.sendWebhook("Invoice created", {
                text: `Invoice ${invoice.id} has been created.`,
            })
        });

    }

    /**
     * 
     * @param {String} title 
     * @param {{
     * embeds?: MessageEmbed[],
     * text?: String,
     * }} data 
     */
    sendWebhook(title, data)
    {
        const webhookClient = new WebhookClient({
            url: this.discord_webhook_url
        });

        let d = {
            title: title,
        }

        if(data.text)
            d.content = data.text;

        if(data.embeds)
            d.embeds = data.embeds;

        webhookClient.send(d);
    }
}