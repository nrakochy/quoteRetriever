(function($) {

  var Quote = Backbone.Model.extend({
    defaults: {
      "source": "",
      "context": "",
      "quote": "",
      "theme": "",
    }
  });

  var Quotes = Backbone.PageableCollection.extend({
    model: Quote,
    mode: "client",
    url:"https://gist.githubusercontent.com/anonymous/8f61a8733ed7fa41c4ea/raw/1e90fd2741bb6310582e3822f59927eb535f6c73/quotes.json",

    state: {
      firstPage: 1,
      pageSize: 5,
    },

    filter: function(attributes){
      var paredResults = this.where(attributes);
      return new Quotes(attributes);
    }
  });

  var QuoteView = Backbone.View.extend({
    tagName: "dl",
    className: "quote-container",
    template: $("#quoteTemplate").html(),

    render: function(){
      var tmpl = _.template(this.template);
      $(this.el).html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  var QuotesView = Backbone.View.extend({
    el: $("#quotes"),

    render: function(){
      var quoteModel = this;
      _.each(this.collection.models, function(quote){
        quoteModel.renderQuote(quote)
      }, this);
    },

    renderQuote: function(item){
      var quoteView = new QuoteView({
        model: item
      });
      this.$el.append(quoteView.render().el);
    },
  });

  var quotesCollection = new Quotes();
  var allQuotesDisplay = new QuotesView({
    collection: quotesCollection
  });

  quotesCollection.fetch({
    success: function(){
      allQuotesDisplay.render();
    }
  });

}(jQuery));
