(function($) {

  /* Models */
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
      pageSize: 15,
    },

    filterModel: function(attributes){
      var paredResultsArr = this.fullCollection.where(attributes);
      return new Quotes(paredResultsArr);
    }
  });

  var PageLink = Backbone.Model.extend({
    defaults: {
      "pageNum": "",
    }
  });

  /* Views */
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

  var PageLinkView = Backbone.View.extend({
    tagName: "div",
    className: "links-container",
    template: $("#pageLinksTemplate").html(),

    render: function(){
      var tmpl = _.template(this.template);
      $(this.el).html(tmpl(this.model.toJSON()));
      return this;
    }
  });

  var QuotesView = Backbone.View.extend({
    el: $("#quotes"),
    events: {
      "click #allQuotes":  function(){ this.resetToAllQuotes() },
      "click #gameQuotes": function(){ this.filterView("games") },
      "click #movieQuotes": function(){ this.filterView("movies") },
      "click #pageNumLink": function(){ this.renderPage(event) },
    },

    render: function(){
      var display = this;
      display.clearBinding();
      display.renderFilters();
      display.renderPageLinks();
      this.currentView = _.each(this.collection.models, function(quote){
        display.renderQuote(quote);
      }, this);
    },

    clearBinding: function(){
      if(this.currentView){
        $(this.el).empty();
      }
    },

    renderQuote: function(quote){
      var quoteView = new QuoteView({ model: quote });
      this.$el.append(quoteView.render().el);
    },

    renderFilters: function(){
      var filters = new FilterOptionsView()
      this.$el.append(filters.render().el)
    },

    renderPageLinks: function(){
      for(num = 1; num <= this.collection.state.totalPages; num++){
        var linkNum = new PageLink({pageNum: num})
        var link = new PageLinkView({ model: linkNum })
        this.$el.append(link.render().el)
      }
    },

    findNumPages: function(){
      for(num = 1; num <= this.collection.state.totalPages; num++){
        var linkNum = new PageLink({pageNum: num})
      }
    },

    filterView: function(filterQuery){
      displayCollection = allQuotesCollection.filterModel({theme: filterQuery});
      this.collection = displayCollection;
      this.render();
    },

    resetToAllQuotes: function(){
      this.collection = allQuotesCollection;
      this.render();
    },

    renderPage: function(event){
      var numString = $(event.target).attr("data-id");
      var pageNum = parseInt(numString);
      collectionPage = displayCollection.getPage(pageNum);
      this.collection = collectionPage;
      this.render();
    }
  });

  var displayCollection;
  var allQuotesCollection = new Quotes();
  var allQuotesDisplay = new QuotesView({
    collection: allQuotesCollection
  });

  allQuotesCollection.fetch({
    success: function(){
      displayCollection = allQuotesCollection;
      allQuotesDisplay.render();
    }
  });

}(jQuery));
