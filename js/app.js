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
      pageSize: 50,
    },

    filterModel: function(attributes){
      var paredResultsArr = this.where(attributes);
      return new Quotes(paredResultsArr);
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
    },
  });

  var FilterOptionsView = Backbone.View.extend({
    tagName: "div",
    className: "filters-container",
    template: $("#filterOptionsTemplate").html(),

    render: function(){
      var tmpl = _.template(this.template);
      $(this.el).html(tmpl);
      return this;
    }
  });

  var QuotesView = Backbone.View.extend({
    el: $("#quotes"),
    events: {
      "click #allQuotes":  function(){ this.resetToAllQuotes() },
      "click #gameQuotes": function(){ this.filterView("games") },
      "click #movieQuotes": function(){ this.filterView("movies") },
    },

    render: function(){
      if(this.currentView){
        $(this.el).empty();
      }

      var display = this;
      var filters = new FilterOptionsView()
      this.$el.append(filters.render().el)
      this.currentView = _.each(this.collection.models, function(quote){
        display.renderQuote(quote)
      }, this);
    },

    renderQuote: function(quote){
      var quoteView = new QuoteView({
        model: quote
      });
      this.$el.append(quoteView.render().el);
    },

    filterView: function(filterQuery){
      filteredCollection = allQuotesCollection.filterModel({theme: filterQuery});
      this.collection = filteredCollection;
      this.render();
    },

    resetToAllQuotes: function(){
      this.collection = allQuotesCollection;
      this.render();
    }
  });

  var allQuotesCollection = new Quotes();
  var allQuotesDisplay = new QuotesView({
    collection: allQuotesCollection
  });

  var filteredCollection;

  allQuotesCollection.fetch({
    success: function(){
      allQuotesDisplay.render();
    }
  });


}(jQuery));
