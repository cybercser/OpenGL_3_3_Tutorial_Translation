jQuery(document).ready(function () {
    jQueryTOC.source_selector = 'div.entry-content';
    jQueryTOC.header_tag = 'h1';
    jQueryTOC.output_id = 'jquery_toc';

  jQueryTOC.toc_started = false;
  jQuery('div.entry-content h1, div.entry-content h2, div.entry-content h3').each(function (index) {

    // Create div if needed
    if(!jQueryTOC.toc_started) {
      jQuery(jQueryTOC.source_selector).prepend('<div id="'+jQueryTOC.output_id+'"><a name="top"></a><p></p><ul></ul></div>');
      jQueryTOC.toc_started = true;
    }

    var offset=3;
    if (this.nodeName=='H1'){offset=0;}
    if (this.nodeName=='H2'){offset=1;}
    if (this.nodeName=='H3'){offset=2;}
    offset = offset * 30;

    // Manipulate h* tag
    var header = jQuery(this);
    var headerId = 'header-'+index;
    header.attr('id', headerId);

    // Manipulate list
    var li = jQuery('<li></li>').attr({ 'style': 'margin-left:'+offset+'px;' }).appendTo('#' + jQueryTOC.output_id + ' ul');
    jQuery('<a></a>').text(header.text()).attr({ 'title': 'Jump to '+header.text(), 'href': '#'+headerId, }).appendTo(li);

    jQuery('h2', this).each(function(index){
        jQuery('<a></a>').text("hello").appendTo(li);
    });

  });
  jQuery(jQueryTOC.source_selector +' '+ jQueryTOC.header_tag).wrapInner('<a title="Back to top" href="#top"></a>');
});