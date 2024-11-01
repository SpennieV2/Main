document.addEventListener('DOMContentLoaded', function () {
    var searchInput = document.getElementById('searchInputProduct');
    var productListContainer = document.getElementById('product-grid');

    // Debounce function to delay execution
    function debounce(func, delay) {
        let debounceTimer;
        return function() {
            const context = this;
            const args = arguments;
            clearTimeout(debounceTimer);
            debounceTimer = setTimeout(() => func.apply(context, args), delay);
        };
    }
   searchInput.addEventListener('input', debounce(function () {
        productListContainer.innerHTML = '';
        var query = searchInput.value.trim();

      
        if (query.length === 0) {
            query = '*'; 
        }

        fetch('/search/suggest.json?q=' + query)
            .then(response => response.json())
            .then(data => {
              
                displaySearchResults(data.resources.results.products);
            })
            .catch(error => console.error('Error fetching search results:', error));
    }, 300));

    function displaySearchResults(products) {
        // Update the UI with search results
        var resultsHTML = '';

        $(".pagination-wrapper").remove();
        if (Array.isArray(products)) {
            products.forEach(product => {
                showLoader();
                const myHeaders = new Headers();
                

                const requestOptions = {
                    method: "GET",
                    headers: myHeaders,
                };

                fetch(`https://spennieapp.skylinxtech.co/api/get-variant/${product.id}`, requestOptions)
                    .then((response) => response.text())
                    .then(result => {
                        const parsedData = JSON.parse(result);

                        const firstVariantId = parsedData.variants.length > 0 ? parsedData.variants[0].id : null;
                      

                        
                       
                        let add_btn = '';
                        $("#ProductCountDesktop").empty().append(`${products.length} Products`);
                        $(".product-count-show").empty().append(`( ${products.length} Products )`);

                        if (parsedData.variants.length == 1) {
                            add_btn = `<product-form data-section-id="template--17342767431930__product-grid">
                                <form method="post" action="/cart/add" id="quick-add-template--17342767431930__product-grid${product.id}"
                                    accept-charset="UTF-8" class="form" enctype="multipart/form-data" novalidate="novalidate"
                                    data-type="add-to-cart-form" data-id="{{ card_product.id }}">
                                        <input type="hidden" name="form_type" value="product">
                                        <input type="hidden" name="utf8" value="✓">
                                        <input type="hidden" name="id" value="${firstVariantId}" class="product-variant-id">
                                    <button id="quick-add-template--17342767431930__product-grid${product.id}-submit" type="submit" name="add"
                                        class="quick-add__submit  button button--full-width button--secondary" aria-haspopup="dialog"
                                        aria-labelledby="quick-add-template--17342767431930__product-grid${product.id}-submit title-template--17342767431930__product-grid-${product.id}"
                                        aria-live="polite" data-sold-out-message="true">
                                        <span>Add to cart
                                        </span>
                                        <div class="loading__spinner hidden">
                                            <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66"
                                                xmlns="http://www.w3.org/2000/svg">
                                                <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                                            </svg>
                                        </div>
                                    </button>
                                    <div style="display: flex;margin-top: 10px;">
                                        <button id="" type="button" name="add" class="shopify-challenge__button add_to_registry"
                                            style="width: 62%;color: black;background: white;">Add To Registry</button>
                    
                                        <div style="width: 38%;display: flex;">
                                            <button class="qty-left qty_upate" data-action="minus" data-id="${product.id}"
                                                data-var-id="${firstVariantId}" type="button">-</button>
                                            <input type="number" readonly="" data-id="${product.id}" data-var-id="${firstVariantId}"
                                                class="regis_quantity update_qty${product.id}${firstVariantId}" id="quantity${product.id}"
                                                value="0" min="0">
                                            <button class="qty-right qty_upate" data-action="plus" data-id="${product.id}"
                                                data-var-id="${firstVariantId}" type="button">+</button>
                                        </div>
                                    </div>
                                    <input type="hidden" name="product-id" value="${product.id}">
                                    <input type="hidden" name="section-id" value="template--17342767431930__product-grid">
                                </form>
                            </product-form>`;
                        }
                      else{
                         add_btn=`<modal-opener data-modal="#QuickAdd-${product.id}">
                                      <button id="quick-add-template--17342767431930__product-grid${product.id}-submit" type="submit" name="add"
                                          data-id="${product.id}" data-var-id="${firstVariantId}"
                                          class="get_stock quick-add__submit button button--full-width button--secondary" aria-haspopup="dialog"
                                          aria-labelledby="quick-add-template--17342767431930__product-grid${product.id}-submit title-template--17342767431930__product-grid-${product.id}"
                                          data-product-url="${product.url}">
                                          Choose options
                                  
                                  
                                          <link
                                              href="//spennie-v2.myshopify.com/cdn/shop/t/1/assets/component-loading-spinner.css?v=116724955567955766481705930880"
                                              rel="stylesheet" type="text/css" media="all">
                                  
                                          <div class="loading__spinner hidden">
                                              <svg aria-hidden="true" focusable="false" class="spinner" viewBox="0 0 66 66"
                                                  xmlns="http://www.w3.org/2000/svg">
                                                  <circle class="path" fill="none" stroke-width="6" cx="33" cy="33" r="30"></circle>
                                              </svg>
                                          </div>
                                      </button>
                                  </modal-opener><quick-add-modal id="QuickAdd-${product.id}" class="quick-add-modal">
                                      <div role="dialog" aria-label="Choose options for Nowboardss" aria-modal="true"
                                          class="quick-add-modal__content global-settings-popup" tabindex="-1">
                                          <button id="ModalClose-${product.id}" type="button" class="quick-add-modal__toggle" aria-label="Close">
                                              <svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false" class="icon icon-close"
                                                  fill="none" viewBox="0 0 18 17">
                                                  <path
                                                      d="M.865 15.978a.5.5 0 00.707.707l7.433-7.431 7.579 7.282a.501.501 0 00.846-.37.5.5 0 00-.153-.351L9.712 8.546l7.417-7.416a.5.5 0 10-.707-.708L8.991 7.853 1.413.573a.5.5 0 10-.693.72l7.563 7.268-7.418 7.417z"
                                                      fill="currentColor">
                                                  </path>
                                              </svg>
                                  
                                          </button>
                                          <div id="QuickAddInfo-${product.id}" class="quick-add-modal__content-info"></div>
                                      </div>
                                  </quick-add-modal>`;
                        
                      }
                      
                      resultsHTML += `
                        <li class="grid__item scroll-trigger animate--slide-in" style="--animation-order: 1;">
                            <!-- Your product card content goes here -->
                            <div class="card-wrapper display_none show_card${product.id} product-card-wrapper underline-links-hover">
                                <div class="card card--standard card--media">
                                    <div class="card__inner color-background-2 gradient ratio">
                                        <div class="card__media">
                                            <div class="media media--transparent media--hover-effect">
                                                <img src="${product.image}" alt="${product.title}" width="360" height="533">
                                            </div>
                                        </div>
                                        <div class="card__content">
                                            <div class="card__information">
                                                <h3 class="card__heading">
                                                    <a href="${product.url}" class="full-unstyled-link">${product.title}</a>
                                                </h3>
                                            </div>
                                            <div class="card__badge bottom left">
                                                <span class="badge badge--bottom-left color-accent-2">${product.sale ? 'Sale' : ''}</span>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="card__content">
                                        <div class="card__information">
                                            <h3 class="card__heading h5">
                                                <a href="${product.url}" class="full-unstyled-link">${product.title}</a>
                                            </h3>
                                            <div class="card-information">
                                                <span class="caption-with-letter-spacing light">${product.vendor}</span>
                                                <div class="price price--on-sale">
                                                    <div class="price__container">
                                                        <div class="price__regular">
                                                            <span class="price-item price-item--regular">$ ${product.price}</span>
                                                        </div>
                                                        <div class="price__sale">
                                                            <s class="price-item price-item--regular">$ ${product.compare_at_price_min}</s>
                                                            <span class="price-item price-item--sale price-item--last">$ ${product.price}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                            </div>
                                        </div>
                                        <div class="quick-add no-js-hidden">${add_btn}</div>
         
                                    </div>
                                </div>
                            </div>
                        </li>`;
                      
                    productListContainer.innerHTML = resultsHTML;
                        hideLoader();
                    })
                    
                    .catch((error) => console.error(error));
                
                   
                });
      
         getProduct();
      }
 
     
    }
  });



let currentSlide = 0;

  function showSlide(index) {
    const sliderContent = document.querySelector('.slider-content');
    const sliderItems = document.querySelectorAll('.slider-item');
    const totalSlides = sliderItems.length;

    if (index >= totalSlides) {
      currentSlide = 0;
    } else if (index < 0) {
      currentSlide = totalSlides - 1;
    } else {
      currentSlide = index;
    }

    const translateValue = -currentSlide * 100 + '%';
    sliderContent.style.transform = 'translateX(' + translateValue + ')';
  }

  function prevSlide() {
    showSlide(currentSlide - 1);
  }

  function nextSlide() {
     

    showSlide(currentSlide + 1);
  }



$(document).ready(function(){
  // var input = document.querySelector("#phone-input");
  // var iti = window.intlTelInput(input, {
  //     separateDialCode: true,
  //     initialCountry: "auto",
  //     geoIpLookup: function (success, failure) {
  //         $.get("https://ipinfo.io", function () {}, "jsonp").always(function (resp) {
  //             var countryCode = (resp && resp.country) ? resp.country : "us";
  //             success(countryCode);
  //         });
  //     },
  //     utilsScript: "https://cdnjs.cloudflare.com/ajax/libs/intl-tel-input/17.0.3/js/utils.js",
  //     formatOnDisplay: true,
  //     nationalMode: false,
  // });
   $('#phoneInput').mask('(000) 000-0000', {
        onChange: function (phoneNumber, e, currentField, options) {
            // Trigger validation on every change
            validatePhoneNumber(phoneNumber);
        }
    });

    function validatePhoneNumber(phoneNumber) {
        // Regular expression for US and international phone numbers
        var phoneRegex = /^\(\d{3}\) \d{3}-\d{4}$/;

        if (phoneRegex.test(phoneNumber)) {
            console.log('Valid phone number');
            // You can perform additional actions for valid phone numbers here
        } else {
            console.log('Invalid phone number');
            // You can perform additional actions for invalid phone numbers here
        }
  }
  $(document).on("click","#check_id",function() {
    if ($('#check_id').is(":checked"))
    {
      $(".event-date").prop('disabled', true);

    }
    else{
      $(".event-date").prop('disabled',false );
    }
  });

  $(document).on("click",".formbold-btn",function() {
    var active=$(this).attr('active');
    if(active == 2)
    {
      let partner_firstname=$('#firstname-second').val();
      let partner_lastname=$('#lastname-second').val();
      let partner_Phone=$('#phoneInput').val();
      if(partner_firstname.length == 0)
      {
          toastr.error("First name required");
          return false;
  
      }
      if(partner_lastname.length == 0)
      {
          toastr.error("Last name required");
          return false;
  
      }
      // if(partner_Phone.length == 0)
      // {
      //     toastr.error("phone number required");
      //     return false;
  
      // }
      $(".formbold-form-step-"+active).removeClass('active');
      $(".formbold-step-menu"+active).removeClass('active');
            
      active++;
      $(this).attr('active',active);
      $(".formbold-form-step-"+active).addClass('active');
      $(".formbold-step-menu"+active).addClass('active');
      return false;
      
     

         

    }

      
      if(active == 3)
      {
        
        
        let customerId          =  $("#customer-id").val(); 
        let partner_first_name  =  $("#firstname-second").val();
        
        let partner_last_name  =  $("#lastname-second").val();
        let phone               =  $("#phoneInput").val();
        let code                =  $(".code-select").val();
        let partner_phone       =  code+phone ;
        let event               =  $("#check_id").val();
        let event_day           =  $('input[name="event-day"]').val();
        let event_month         =  $('.event-month').val();
        let event_year          =  $('.event-year').val();
        let current_year        = new Date().getFullYear();
        if(event_year < current_year)
        {
           toastr.error("Enter a valid year");
           return false;

        }
        var form = new FormData();
        form.append("customer_id", customerId);
        form.append("partner_first_name",partner_first_name);
        form.append("partner_last_name", partner_last_name);
        form.append("partner_phone", partner_phone);
        form.append("event_day",event_day);
        form.append("event_month", event_month);
        form.append("event_year", event_year);


          if($("#check_id").prop("checked") == true)
          {
            form.append("event","on" );
          }
    
          else{
            form.append("event", "off");
          }
        let api_url=base_url+"api/create-customer";
        var settings = {
          "url": api_url,
          "method": "POST",
          "timeout": 0,
          "processData": false,
          "mimeType": "multipart/form-data",
          "contentType": false,
          "data": form
        };
        var get_this=$(this);
        (async function() {
            try {
                const response = await $.ajax(settings);
                const responseData = JSON.parse(response);
        
                if (responseData.status == 200) {
                    toastr.success(responseData.msg);
                    window.location.href = "https://spennie.com/pages/preview-registery";
                  $(".formbold-form-step-"+active).removeClass('active');
                  $(".formbold-step-menu"+active).removeClass('active');
            
                  active++;
                  get_this.attr('active',active);
                  $(".formbold-form-step-"+active).addClass('active');
                  $(".formbold-step-menu"+active).addClass('active');
                } else {
                    toastr.error(responseData.msg);
                }
        
                console.log(responseData.msg);
                console.log(responseData.status);
        
                // This will be executed after the AJAX request is completed
            } catch (error) {
                console.error("Error:", error);
            }
        })();
        
       

      

        
      }
      

  });
// $('#Details-HeaderMenu-4').hover(
//     function () {
//       $(this).attr('open', '');
//     },
//     function () {
//       $(this).removeAttr('open');
//     }
//   );

   var megaMenu = $('#Details-HeaderMenu-4');
  var megaMenuContent = $('#MegaMenu-Content-4');

  // Add open attribute on hover
  megaMenu.hover(
    function () {
      megaMenu.attr('open', '');
    },
    function () {
      // Remove open attribute when mouse leaves the mega menu or its content
      if (!megaMenuContent.is(':hover')) {
        megaMenu.removeAttr('open');
      }
    }
  );

  // Remove open attribute when mouse leaves the mega menu content
  megaMenuContent.hover(
    function () {
      // Keep the mega menu open when the mouse is over the content
      megaMenu.attr('open', '');
    },
    function () {
      // Remove open attribute when mouse leaves the mega menu content
      megaMenu.removeAttr('open');
    }
  );
  $(document).on("click",".logout-click",function(e) {
     
    e.preventDefault();

    $.ajax({
      type: "POST",
      url: '/cart/clear.js',
      success: function(){
        window.location.href = "/account/logout";

      },
      dataType: 'json'
    });
    
  });
  $(document).on("click",".check_customer",function() {
    $(this).empty().append(`<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span><span class="sr-only">Loading...</span>`);
     $(this).prop('disabled', true);

      let get_email=$(".get_email").val();
      let get_first_name=$('.get_first_name').val();
      let get_last_name=$('.get_last_name').val();
      let get_password=$('.get_password').val();
      let get_phone=$('.get_phone').val();
      if(get_first_name.length == 0 || get_last_name.length == 0 || get_password.length == 0 || get_email.length == 0 || get_phone.length == 0)
      {
        if(get_first_name.length == 0)
        {
            toastr.error("First name required");
    
        }
        if(get_last_name.length == 0)
        {
            toastr.error("Last name required");
    
        }
        if(get_email.length == 0)
        {
            toastr.error("Email is required");
    
        }
        if(get_password.length == 0)
        {
            toastr.error("Password is required");
    
        }
        if(get_phone.length == 0)
        {
            toastr.error("Phone number is required");
    
        }
        
        return false;
  
      }
      
        let api_url=`https://spennieapp.skylinxtech.co/api/search-email/${get_email}`;
        const myHeaders = new Headers();
        
        
        const requestOptions = {
          method: "GET",
          headers: myHeaders,
          redirect: "follow"
        };
   
        
        fetch(api_url, requestOptions)
          .then((response) => response.text())
          .then((result) => {

     
            const data = JSON.parse(result);

            if(data.customers.length ==1)
            {
                toastr.error("Email already exsists");
               $(this).empty().append(`Next`);
               $(this).prop('disabled', false);
                return false;

            }
            else{
              $(".create_customer").click();
            }


         


            
       

          })
          .catch((error) => console.error(error));
        
        
          
      });


});
function createCustomer(firstname,lastname,Email,Phone,Password,active,this_var) {
 
  var myHeaders = new Headers();
  
  
  myHeaders.append("Content-Type", "application/json");
  
  var raw = JSON.stringify({
    "customer": {
      "first_name": firstname,
      "last_name": lastname,
      "email": Email,
      "phone": Phone,
      "verified_email": true,
      "password": Password,
      "password_confirmation": Password,
      "send_email_welcome": false,
      "tags":"couple"
    }
  });
  
  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };
  async function fetchData() {
    let get_error = '';
    let code = '';
  
    try {
      const response = await fetch("https://spennie-v2.myshopify.com/admin/api/2024-01/customers.json", requestOptions);
      const result = await response.json();
      get_error = result;
      code =  response.status;

    } catch (error) {
      get_error = error;
    }
    const responseJson=get_error;
    let errors = responseJson.errors
    for (key in errors) {
     

          toastr.error(errors[key][0]);

    }
    // let errorsArray = Object.values(responseJson.errors).flat()
    
    // errorsArray.forEach(error => {
    //   console.log('Err: ',error)
    // })
    
    if(code ==201)
    {
      
      $(".formbold-form-step-"+active).removeClass('active');
      $(".formbold-step-menu"+active).removeClass('active');

      active++;
      this_var.attr('active',active);
      $(".formbold-form-step-"+active).addClass('active');
      $(".formbold-step-menu"+active).addClass('active');
    }
    
        

    
    
  }
  fetchData();

  
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

                        if(typeof product.variant.variant !== 'undefined') {

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
                        }
                            
                      });
                      }
                  
      
      
                  
                      $(".show_only_added").removeClass('d-none');
                  
                });
}


function createAssociativeArray() {
    // Select all elements with class "variant_id"

    
    showLoader();
    var variantIdInputs = $('.variant_id');
    var note = $('.gift_msg').val();
    var quantityInputs = $('.quantity__input');

    var associativeArray = [];

    variantIdInputs.each(function (index) {
        var variantId = $(this).val();
        var quantity = quantityInputs.eq(index).val();

        // Array to store option objects for each variant
        var optionsArray = [];

        $('.option_name' + variantId).each(function (indexs) {
            var optionName = $(this).val();
            var optionValueInput = $('.option_value' + variantId).eq(indexs);
    
            console.log('Associative optionValueInput:', optionValueInput.val());
            console.log('Associative optionName:', optionName);

            var optionObject = {
                option_name: optionName,
                option_value: optionValueInput.val()
            };
            optionsArray.push(optionObject);



           
        });

        // Create an object with "variant_id", "quantity", and "options" properties
        var pairObject = {
            variant_id:  variantId,
            quantity:  quantity,
            option:optionsArray,
           
        };

        // Push the object to the associativeArray
        associativeArray.push(pairObject);
    });

  
      var storedId = localStorage.getItem("cart_registry_id");
      var settings = {
      "url":base_url + "api/createCheckout",
      "method": "POST",
      "timeout": 0,
      "headers": {
        "Content-Type": "application/json"
      },
      
      "data": JSON.stringify({
                "registry_id": storedId,
                "items": associativeArray,
                "note":note
       }),
    };
    
    $.ajax(settings).done(function (response) {
      console.log(response);
      if(response.status == 200)
      {
        hideLoader();
        window.location.href = response.data;

        
      }
      else{
         hideLoader();
         toastr.error("Invalid shipping address");
 
      }
    });
  

   
}




function showLoader() {
    $('#loader-container').show();
}

function hideLoader() {
  $('#loader-container').hide();
}

