(function($) {
	
	'use strict';
	
	var Minima = {
		
		// Initialization the functions
		init: function() {
			Minima.AffixMenu();
			Minima.ScrollSpy();
			Minima.SmoothScroll();
			Minima.FitVids();
			Minima.PlaceHolder();
			Minima.Carousel();
			Minima.Lightbox();
			Minima.CounterUp();
			Minima.Form();
			Minima.Scrollup();
			
			$(window).on('load', function() {
				Minima.Animated();
			});
		},
		
		// Navigation menu affix
		AffixMenu: function() {
			var navMenu	= '<nav id="navigation_affix">';
			navMenu		+= '<div class="container">';
			navMenu		+= '<div class="navbar-brand">';
			navMenu		+= '<a href="index.html"><img src="images/logo_affix.png" alt="Logo" /></a>';
			navMenu		+= '</div>';
			navMenu		+= '<ul class="nav navbar-nav">';
			navMenu		+= $('#navigation .nav.navbar-nav').html();
			navMenu		+= '</ul>';
			navMenu		+= '</div>';
			navMenu		+= '</nav>';
			
			$('#header').before(navMenu);
			
			if ($('#navigation').hasClass('scrollspy')) {
				$('#navigation_affix').addClass('scrollspy');
			}
			
			$('#navigation').waypoint(function() {
				$('#navigation_affix').removeClass('show');
			}, {
				offset: -100
			});
			
			$('#navigation').waypoint(function() {
				$('#navigation_affix').addClass('show');
			}, {
				offset: -101
			});
		},
		
		// Navigation menu scrollspy to anchor section
		ScrollSpy: function() {
			setTimeout(function() {
				$('body').scrollspy({
					target: '#navigation_affix.scrollspy',
					offset: 71
				});
			}, 100);
		},
		
		// Smooth scrolling to anchor section
		SmoothScroll: function() {
			$('a.smooth-scroll').on('click', function(event) {
				var $anchor		= $(this);
				var offsetTop	= '';
				
				if (window.Response.band(768)) {
					offsetTop = parseInt($($anchor.attr('href')).offset().top - 70, 0);
				} else {
					offsetTop = parseInt($($anchor.attr('href')).offset().top, 0);
				}
				
				$('html, body').stop().animate({
					scrollTop: offsetTop
				}, 1500,'easeInOutExpo');
				
				event.preventDefault();
			});
		},
		
		// Responsive video size
		FitVids: function() {
			$('body').fitVids();
		},
		
		// Placeholder compatibility for IE8
		PlaceHolder: function() {
			$('input, textarea').placeholder();
		},
		
		// Slider with Slick carousel
		Carousel: function() {
			// Testimonials slider
			$('.carousel-slider.testimonials-slider').slick({
				arrows: false,
				dots: true,
				speed: 300,
				autoplay: true,
				autoplaySpeed: 5000,
				draggable: false,
				responsive: [{
					breakpoint: 768,
					settings: {
						draggable: true
					}
				}]
			});
			
			// Screenshots slider
			$('.carousel-slider.screenshots-slider').slick({
				arrows: false,
				dots: true,
				speed: 400,
				autoplay: true,
				autoplaySpeed: 5000,
				draggable: false,
				responsive: [{
					breakpoint: 768,
					settings: {
						draggable: true
					}
				}]
			});
			
			// General slider
			$('.carousel-slider.general-slider').slick({
				dots: true,
				speed: 300,
				adaptiveHeight: true,
				draggable: false,
				responsive: [{
					breakpoint: 768,
					settings: {
						draggable: true
					}
				}]
			});
		},
		
		// Preview images popup gallery with Fancybox
		Lightbox: function() {
			$('.fancybox').fancybox({
				loop: false
			});
			
			$('.fancybox-media').attr('rel', 'media-gallery').fancybox({
				openEffect: 'none',
				closeEffect: 'none',
				prevEffect: 'none',
				nextEffect: 'none',
				arrows: false,
				helpers: {
					title: null,
					media: {},
					buttons : {}
				}
			});
		},
		
		// Number counter ticker animation
		CounterUp: function() {
			$('.affa-counter > h4 > span').counterUp({
				delay: 10,
				time: 3000
			});
		},
		
		// Form submit function
		Form: function() {
			var pattern = /^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))$/i;
			
			// Checking subcribe form input when focus and keypress event
			$('.affa-form-subscribe input[type="text"], .affa-form-subscribe input[type="email"]').on('focus keypress', function() {
				var $input = $(this);
				
				if ($input.hasClass('error')) {
					$input.val('').removeClass('error');
				}
				if ($input.hasClass('success')) {
					$input.val('').removeClass('success');
				}
			});
			
			// Subscribe form when submit button clicked
			$('.affa-form-subscribe').submit(function() {
				var $email	= $(this).find('input[name="email"]');
				var $submit	= $(this).find('input[name="submit"]');
				
				if (pattern.test($email.val()) === false) {
					$email.val('Please enter a valid email address!').addClass('error');
				} else {
					var submitData = $(this).serialize();
					$email.attr('disabled', 'disabled');
					$submit.attr('disabled', 'disabled');
					$.ajax({
						type: 'POST',
						url: 'process-subscribe.php',
						data: submitData + '&action=add',
						dataType: 'html',
						success: function(msg) {
							if (parseInt(msg, 0) !== 0) {
								var msg_split = msg.split('|');
								
								if (msg_split[0] === 'success') {
									$submit.removeAttr('disabled');
									$email.removeAttr('disabled').val(msg_split[1]).addClass('success');
								} else {
									$submit.removeAttr('disabled');
									$email.removeAttr('disabled').val(msg_split[1]).addClass('error');
								}
							}
						}
					});
				}
				
				return false;
			});
		},
		
		// Back to top button function
		Scrollup: function() {
			$('.scrollup').click(function() {
				$('html, body').stop().animate({
					scrollTop: 0
				}, 2000, 'easeInOutExpo');
				
				return false;
			});
		},
		
		// Embed animation effects to HTML elements with CSS3
		Animated: function() {
			$('.animation, .animation-visible').each(function() {
				var $element = $(this);
				$element.waypoint(function() {
					var delay = 0;
					if ($element.data('delay')) delay = parseInt($element.data('delay'), 0);
					if (!$element.hasClass('animated')) {
						setTimeout(function() {
							$element.addClass('animated ' + $element.data('animation'));
						}, delay);
					}
					delay = 0;
				}, {
					offset: '85%'
				});
			});
		}
		
	};
	
	// Run the main function
	$(function() {
		Minima.init();
	});
	
})(window.jQuery);
