rjs = function () {
  // find all the HTML elements with a class of 'r-code'
  r_code_blocks = document.querySelectorAll('.r-code')
  
  
  r_code_blocks.forEach(function (code_block) {
    
    let code_text = code_block.innerHTML
    
    code_block.innerHTML = '&block;&block;&block;&block;&block;&blk12;&blk12;&blk12;&blk12;&blk12;'
    
    let xhttp_initial_request = new XMLHttpRequest()
    xhttp_initial_request.onreadystatechange = function() {
      if (this.readyState == 4) {
        if (this.status == 201) { 
          let output_url = this.responseText.match(/tmp\/(.*?output.\w+)/);          
          output_url = 'http://tmp.ocpu.io/' + output_url[1];          
          console.log(output_url);          
          let xhttp_followup_request = new XMLHttpRequest();
          
          xhttp_followup_request.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
              
              // Detect if this has an output specified that is NOT html_document or html_notebook.
              // If so, provide a link to the output file
              if (/^\s*?---[\s\S]+?output:[\s\S]+?---/.test(code_block.innerHTML) && !(/^\s*?---[\s\S]+?output:\s+?html_(document|notebook)[\s\S]+?---/.test(code_block.innerHTML))) {
                code_block.innerHTML = '<a href="' + output_url +'" target="_blank">Click here to view file</a>';
              } else {
                code_block.innerHTML = this.responseText; 
              }
            }
          };
          xhttp_followup_request.open('GET', output_url, true);
          xhttp_followup_request.send();
        } else {
          console.log(this.status);
          code_block.innerHTML = this.responseText.replace('\n\nIn call:\nparse(text = x, srcfile = src)', '').replace(/\n/g, '<br>');
        }
        code_block.classList.remove("r-code");
        code_block.classList.add("r-code-output");
      }
    };
    xhttp_initial_request.open('POST', 'http://kdpsingh.ocpu.io/RendereR/R/renderer', true);
    
    var formData = new FormData();
   
    formData.append('text', JSON.stringify({"text": encodeURIComponent(code_text)}))
  
   if (code_block.hasAttribute('file')) {
   let file_xhr = new XMLHttpRequest();

    file_xhr.open("GET", code_block.getAttribute('file'), true);
    file_xhr.responseType = 'blob'

    file_xhr.onload = function(e)
    {
      if (file_xhr.readyState === 4)
      {
        
        file = file_xhr.response;
        
        formData.append('file', file, 'file.RData')
     xhttp_initial_request.send(formData)
      }
    }
    file_xhr.send();
  } else {
    xhttp_initial_request.send(formData)
  }
    

  });
  
}

window.onload = function () {
  rjs();
};
