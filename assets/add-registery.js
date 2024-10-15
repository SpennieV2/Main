function showLoader() {
    $('#loader-container').show();
  }

  function hideLoader() {
    $('#loader-container').hide();
  }


$(document).ready(function(){
 
     
  
      var getregistery_id='';

      let total=$("#ProductCountDesktop").text();
      $(".product-count-show").empty().append(' ('+total+')');
      let customer_id = document.getElementById('shopfiy-customer-id').value;
      if(customer_id.length != 0){
         var getcurrentUrl = window.location.href;

          var queryParams='';
          if (getcurrentUrl.includes('?')) {
            var urlParts = getcurrentUrl.split('?');
        
             queryParams = urlParts[0];
          }
        else{
            queryParams = window.location.href;

          
        }
        
         // if (queryParams.includes("collections")) 
         // {
           
            showLoader();
           
        
         
            let api_url = base_url + "api/get-registery/" + customer_id;
    
            var settings = {
                url: api_url,
                method: "GET",
                timeout: 0,
            };
    
            $.ajax(settings).done(function (response) {
                if(response.status ==201){
                  localStorage.removeItem('registery_id');
                  // location.href = store_url+"pages/registry-signup";
                  hideLoader();

                }
              else{
                localStorage.setItem('registery_id', response.data);
                const get_registery_id = localStorage.getItem('registery_id');
       
  
                var settings = {
                  "url": base_url + "api/get-registry-products/" +get_registery_id,
                  "method": "GET",
                  "timeout": 0,
                };
            
                $.ajax(settings).done(function (response) {
                     // const responseData = JSON.parse(response);
                     // const responseData = JSON.parse(response);
                      console.log(response['data']);
                      let product=response['data'];
                      if(response.status ==200){
                            product.forEach((product) => {
                        //console.log(product.qty);
                        let qty        =product.variant.variant_qty;

                        if(typeof product.variant.variant !== 'undefined') {

                          let variant_id =product.variant.variant.id;
                          let product_id =product.product_id;
        
                          console.log(qty);
                          console.log(variant_id);
                          console.log(product_id);
                          let customer_id = document.getElementById('shopfiy-customer-id').value;
                          if(customer_id.length != 0){
                            
                          
                            $(".update_qty"+product_id+variant_id).val(qty)
                          }
                          ;
                          $(".show_card"+product_id).removeClass('display_none');
                          $(".show_card"+product_id).addClass('display_block');
                        }
                        
                      });
                      }
                  
      
      
                  
                      $(".show_only_added").removeClass('d-none');
                      hideLoader();
                  
                     // console.log(responseData);
                });
                
              }
                 
    
              
    
            });
         //}
      }
      else{
         hideLoader()
      }
      
   $(document).on('change','.show_product',function(){
      if($(".show_product").prop("checked") == true)
        {
          $(".display_none").css({'display': 'none'});
          $(".display_none").parent().css('display', 'none');
        }
  
        else{
          $(".display_none").css({'display': 'block'});
          $(".display_none").parent().css('display', 'block');

        }
   });
   $(document).on('click', '.qty_upate', function() {
  let action = $(this).attr('data-action');
  let get_this = '';
  let get_qty = '';

  if (action == 'plus') {
    get_this = $(this).prev();
    get_qty = get_this.val();
    get_qty++;
  } else {
    get_this = $(this).next();
    get_qty = get_this.val();
    if (get_qty > 0) {
      get_qty--;
    }
  }

  let customer_id = document.getElementById('shopfiy-customer-id').value;
  if (customer_id.length == 0) {
    location.href = store_url + "account/login";
  } else {
    let customer_email = document.getElementById('shopfiy-customer-email').value;
  
    if (customer_email == 'admin@spennie.com') {
      // Show the modal
      $('#registryModal').show();

      $('#submit-registry-id').on('click', function() {
        const entered_registry_id = $('#registry-id-input').val();
        if (entered_registry_id) {
          submitRequest(entered_registry_id, get_this, get_qty);
          $('#registryModal').hide();
        } else {
          alert('Please enter a valid registry ID');
        }
      });

      // Close the modal when clicking the close button or outside the modal
      $('.close').on('click', function() {
        $('#registryModal').hide();
      });
      $(window).on('click', function(event) {
        if (event.target == document.getElementById('registryModal')) {
          $('#registryModal').hide();
        }
      });
    } else {
      const get_registery_id = localStorage.getItem('registery_id');
      submitRequest(get_registery_id, get_this, get_qty);
    }
  }

  function submitRequest(registery_id, get_this, get_qty) {
    let shopify_product_variant_id = get_this.attr("data-var-id");
    let shopify_product_id = get_this.attr("data-id");

    var form = new FormData();
    form.append("registry_id", registery_id);
    form.append("stock_qty", get_qty);
    form.append("shopify_product_id", shopify_product_id);
    form.append("shopify_product_variant_id", shopify_product_variant_id);
    let api_url = base_url + "api/add-registry-product";

    var settings = {
      "url": api_url,
      "method": "POST",
      "timeout": 0,
      "processData": false,
      "mimeType": "multipart/form-data",
      "contentType": false,
      "data": form
    };

    $.ajax(settings).done(function(response) {
      const responseData = JSON.parse(response);

      if (responseData.status == 200) {
        toastr.success(responseData.msg);
        get_this.val(get_qty);
      } else {
        toastr.error(responseData.msg);
      }

      if (get_qty == 0) {
        $(".show_card" + shopify_product_id).removeClass('display_block');
        $(".show_card" + shopify_product_id).addClass('display_none');
      } else {
        $(".show_card" + shopify_product_id).addClass('display_block');
        $(".show_card" + shopify_product_id).removeClass('display_none');
      }
    });
  }
});

     $(document).on('change', '.facet-filters__sort, .field__input', function () {
        
       // showLoader();
         setTimeout(function() { 
             let total=$("#ProductCountDesktop").text();
      
             $(".product-count-show").empty().append(' ('+total+')');
             getProduct()
           
          }, 2000);
        
     });
    $(document).on('click', '.facet-checkbox, .facets__reset ,.active-facets__button-remove', function () {
     
         // showLoader();
         setTimeout(function() { 
             let total=$("#ProductCountDesktop").text();
             $(".product-count-show").empty().append(' ('+total+')');
             getProduct()
          }, 2000);
        
     });

   $(document).on('click','.product_variant',function(){
     var get_dtate=$(this).hasClass("disabled");
     if(get_dtate == true){
       $(".add-varient_product").attr('disabled',true);
       $(".add-varient_product").attr('aria-disabled',true);

     }
     else{
       $(".add-varient_product").attr('disabled',false);
        $(".add-varient_product").attr('aria-disabled',false);
     }
   });
    $(document).on('click','.add-varient_product',function(){


      let action=$(this).attr('data-action');
      var get_this=$(this);
      var get_qty=$(".quantity__input").val();
      
      
        let customer_id = document.getElementById('shopfiy-customer-id').value;
        if(customer_id.length== 0){
          location.href = store_url+"account/login";
        }else{
          
          const get_registery_id = localStorage.getItem('registery_id');
          let shopify_product_variant_id= get_this.parent().parent().find(".product-variant-id").val();
          let shopify_product_id= get_this.parent().parent().find('input[name="product-id"]').val();


          var form = new FormData();
          form.append("registry_id", get_registery_id);
          form.append("stock_qty", get_qty);
          form.append("shopify_product_id", shopify_product_id);
          form.append("shopify_product_variant_id", shopify_product_variant_id);
          let api_url = base_url + "api/add-registry-product";

          var settings = {
            "url": api_url,
            "method": "POST",
            "timeout": 0,
            "processData": false,
            "mimeType": "multipart/form-data",
            "contentType": false,
            "data": form
          };
          
          $.ajax(settings).done(function (response) {
            const responseData = JSON.parse(response);
        
            if (responseData.status == 200) {
                    toastr.success(responseData.msg);
                    get_this.val(get_qty); 
            }else{
                toastr.error(responseData.msg);
            }
            

            get_this.val(get_qty);
              if(get_qty ==0)
              {
                $(".show_card"+shopify_product_id).removeClass('display_block');
                $(".show_card"+shopify_product_id).addClass('display_none');
              }
              else{
                 $(".show_card"+shopify_product_id).addClass('display_block');
                $(".show_card"+shopify_product_id).removeClass('display_none');
              }
          });
          
          
        }
                
      
      

      
    });

   $(document).on('click','.get_stock',function(){
       let product_id=$(this).attr('data-id');
       let product_variant_id=$(this).attr('data-var-id');
       let customer_id = document.getElementById('shopfiy-customer-id').value;
       if(customer_id.length != 0){
         showLoader();
         var delayInMilliseconds = 1000; //1 second
  
         setTimeout(function() {
            
             const get_registery_id = localStorage.getItem('registery_id');
        
             
                var form = new FormData();
                form.append("product_variant_id",product_variant_id);
                form.append("registery_id", get_registery_id);
        
                var settings = {
        
                  "url": base_url + "api/get_stock",
                  "method": "POST",
                  "timeout": 0,
                  "processData": false,
                  "mimeType": "multipart/form-data",
                  "contentType": false,
                  "data": form
                };
                
                $.ajax(settings).done(function (response) {
                  console.log(response);
                  const responseData = JSON.parse(response);
                  let customer_id = document.getElementById('shopfiy-customer-id').value;
                  if(customer_id.length != 0){
                  
                    // $(".quantity__input").val(responseData.data);
                    
                    $(".add_stock"+product_id).val(responseData.data);
                    hideLoader();
                   
      
                  }
                });
            }, delayInMilliseconds);
       }
       
   });
   $(document).on('click','.get_stock_detail',function(){
      let product_variant_id=$(this).attr('data-var-id');
      let product_id=$(this).attr('data-id');
      let customer_id = document.getElementById('shopfiy-customer-id').value;
      if(customer_id.length != 0){
     

        var delayInMilliseconds = 1000; //1 second
  
        setTimeout(function() {
         
         
          
    
          const get_registery_id = localStorage.getItem('registery_id');
    
        
            var form = new FormData();
            form.append("product_variant_id",product_variant_id);
            form.append("registery_id", get_registery_id);
    
    
            var settings = {
    
              "url": base_url + "api/get_stock",
              "method": "POST",
              "timeout": 0,
              "processData": false,
              "mimeType": "multipart/form-data",
              "contentType": false,
              "data": form
            };
            
            $.ajax(settings).done(function (response) {
              console.log(response);
              const responseData = JSON.parse(response);
              let customer_id = document.getElementById('shopfiy-customer-id').value;
              if(customer_id.length != 0){
                
              
                $(".add_stock"+product_id).val(responseData.data);
              }
            });
          }, delayInMilliseconds);
      }
     
    
     
   });

  

  
    let currentUrl = window.location.href;
    let segments = currentUrl.split('/');
    let get_url = segments[segments.length - 2];
  
    if(get_url == 'products')
    {
      GetStock();
      
      
    }

function getProduct() {
               const get_registery_id = localStorage.getItem('registery_id');
       
            
                var settings = {
                  "url": base_url + "api/get-registry-products/" +get_registery_id,
                  "method": "GET",
                  "timeout": 0,
                };
            
                $.ajax(settings).done(function (response) {
                     // const responseData = JSON.parse(response);
                     // const responseData = JSON.parse(response);
                      console.log(response['data']);
                      let product=response['data'];
                      if(response.status ==200){
                            product.forEach((product) => {
                        //console.log(product.qty);
                        let qty        =product.variant.variant_qty;
                        let variant_id =product.variant.variant.id;
                        let product_id =product.product_id;
      
                        console.log(qty);
                        console.log(variant_id);
                        console.log(product_id);
                        let customer_id = document.getElementById('shopfiy-customer-id').value;
                        if(customer_id.length != 0){
                          
                        
                          $(".update_qty"+product_id+variant_id).val(qty)
                        }
                        ;
                        $(".show_card"+product_id).removeClass('display_none');
                        $(".show_card"+product_id).addClass('display_block');
                        
                      });
                      }
                  
      
      
                  
                      $(".show_only_added").removeClass('d-none');
                      hideLoader();
                  
                     // console.log(responseData);
                });
}
      

function GetStock() {
  

   
      let product_variant_id=$(".product-variant-id").val();
      const get_registery_id = localStorage.getItem('registery_id');

   
        var form = new FormData();
        form.append("product_variant_id",product_variant_id);
        form.append("registery_id", get_registery_id);


        var settings = {

          "url": base_url + "api/get_stock",
          "method": "POST",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form
        };
        
        $.ajax(settings).done(function (response) {
          console.log(response);
          const responseData = JSON.parse(response);
          let customer_id = document.getElementById('shopfiy-customer-id').value;
         
          if(customer_id.length != 0){
            
          
            $(".quantity__input").val(responseData.data);
          }
        });
     
   
}




  // Add an event listener to the search input field
document.getElementById('searchInput').addEventListener('keyup', function() {
  // Get the value entered in the search input
  const searchTerm = this.value.trim().toLowerCase();

  // Get all list items with the class "card__heading"
  const listItems = document.querySelectorAll('.card__heading');

  // Loop through each list item
  listItems.forEach((item) => {
    // Get the text content of the heading within the list item
    const headingText = item.textContent.toLowerCase();

    // Check if the heading contains the search term
    if (headingText.includes(searchTerm)) {
      // If it does, show the list item
      item.closest('.grid__item').style.display = 'block';
    } else {
      // If it doesn't, hide the list item
      item.closest('.grid__item').style.display = 'none';
    }
  });
});

});
  



                
                
        
      
    

