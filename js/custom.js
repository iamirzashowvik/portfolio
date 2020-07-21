/* ============================================================== */
/* Template Name : Metronal - Personal Portfolio Page             */
/* Author        : Rietts Andreas Ruff                            */
/* Author URI    : https://themeforest.net/user/riettsruff        */
/* Version       : 1.2                                            */
/* ============================================================== */

(function($) {

	"use strict";

	// Init Metronal
	var metronal = {};

	// Pre Load
	metronal.preLoad = function(duration) {
		$('#pre-load').fadeOut(parseInt(duration));
	};

	// Replace Viewport Height
	// Solves the issue about the viewport height on mobile devices as when the page loads
	metronal.replaceVHeight = function() {
		$('html').css({
			'height': $(window).height()
		});
	};

	// Portfolio Filter
	metronal.portfolioFilter = {
		// Item container
		container: $('#portfolio .portfolio-item .item-wrapper'),
		// Init function
		init: function() {
			// Checking if all images are loaded
			metronal.portfolioFilter.container.imagesLoaded(function() {
				// Init isotope once all images are loaded
	            metronal.portfolioFilter.container.isotope({
	                itemSelector: '#portfolio .portfolio-item .item-wrapper .item',
	                layoutMode: 'masonry',
	                transitionDuration: '0.8s'
	            });
	            // Forcing a perfect masonry layout after initial load
	            metronal.portfolioFilter.container.isotope('layout');
	            // Filter items when the button is clicked
	            $('#portfolio .portfolio-filter ul li').on('click', 'a', function () {
	            	// Remove the current class from the previous element
	                $('#portfolio .portfolio-filter ul li .current').removeClass('current');
	                // Add the current class to the button clicked
	                $(this).addClass('current');
	                // Data filter
	                var selector = $(this).attr('data-filter');
	                metronal.portfolioFilter.container.isotope({
	                    filter: selector
	                });
	                setTimeout(function () {
	                    metronal.portfolioFilter.container.isotope('layout');
	                }, 6);
	                return false;
	            });
	        });
	    } 
	};

	// Page Transitions
	metronal.pageTransitions = function() {
		var pageFromTo = function(from, to) {
			$('.main-content').removeClass('scaleDownFromFront').removeClass('scaleUpFromFront');
			from.addClass('scaleUpFromFront');
			to.addClass('scaleDownFromFront');
		};
		// The .box-wrapper is clicked
		$('.box-wrapper').on('click', '.inner-box-wrapper', function() {
			var parentOfChild = $(this)[0].parentNode.id;
			switch(parentOfChild) {
				case 'about-menu': 
					pageFromTo($('#home'), $('#about'));
				break;
				case 'resume-menu':
					pageFromTo($('#home'), $('#resume'));
				break;
				case 'portfolio-menu':
					pageFromTo($('#home'), $('#portfolio'));
				break;
				case 'contact-menu':
					pageFromTo($('#home'), $('#contact'));
				break;
			}
		});
		// The close button is clicked
		$('.main-content').on('click', '.close-button', function() {
			var parentOfChild = $(this)[0].parentNode.id;
			switch(parentOfChild) {
				case 'about':
					pageFromTo($('#about'), $('#home'));
				break;
				case 'resume':
					pageFromTo($('#resume'), $('#home'));
				break;
				case 'portfolio':
					pageFromTo($('#portfolio'), $('#home'));
				break;
				case 'contact':
					pageFromTo($('#contact'), $('#home'));
				break;
			}
		});
		// Contact Me button is clicked
		$('.button-wrapper').on('click', '#contact-me a', function() {
			pageFromTo($('#about'), $('#contact'));
		});
	};

	// Use Magnific Popup
	metronal.useMagnificPopup = function() {
		// For portfolio item
		$('#portfolio .portfolio-item .item-wrapper .item').magnificPopup({
			delegate: 'a',
			type: 'inline',
			removalDelay: 300,
			mainClass: 'mfp-fade',
			fixedContentPos: true,
		    callbacks: {
		    	beforeOpen: function() { 
		    		$('html').addClass('mfp-helper'); 
		    	},
		    	close: function() { 
		    		$('html').removeClass('mfp-helper'); 
		    	}
		  	}
		});
	};

	// Set Skill Progress
	metronal.setSkillProgress = function() {
		// Select skill
		var skill = $('.single-skill');
		for(var i = 0; i < skill.length; i++) {
			if(skill.eq(i).find('.percentage')[0].textContent == '100%') {
				skill
					.eq(i)
					.find('.progress-wrapper .progress')
					.css({
						'width': skill.eq(i).find('.percentage')[0].textContent,
						'borderRight': 0
					});
			} else {
				skill
					.eq(i)
					.find('.progress-wrapper .progress')
					.css('width', skill.eq(i).find('.percentage')[0].textContent);
			}
		}
	};

	// Use TypeIt.js
	metronal.useTypeIt = function() {
		if(typeof TypeIt != 'undefined') {
			new TypeIt('.passion', {
				speed: 200,
		        startDelay: 800,
		        strings: ['Flutter Android & iOS Developer', 'UI/UX Designer'],
		        breakLines: false,
		        loop: true
			});
		} else {
			return false;
		}
	};

	// Progress Animation
	metronal.progressAnimation = function() {
		// Disable progress animation on IE Browser
		if(navigator.userAgent.indexOf('MSIE')!==-1 || navigator.appVersion.indexOf('Trident/') > -1) {
			$('.progress-wrapper .progress').css({
				'animation': 'none'
			});
		}
	};

	// Process Contact Form
	metronal.processContactForm = function() {
		var form = $('form[name="contact"]'),
			message = $('.contact-msg'),
			formData;

		// Success Function
		var doneFunc = function(response) {
			message.text(response);
			message
				.removeClass('alert-danger')
				.addClass('alert-success')
				.fadeIn();
			setTimeout(function() {
				message.fadeOut();
			}, 2400);
			form.find('input:not([type="submit"]), textarea').val('');
		};

		// Fail Function
		var failFunc = function(jqXHR, textStatus, errorThrown) {
			if(jqXHR.status === 400) {
				message.text(jqXHR.responseText);
			} else {
				message.text(jqXHR.statusText);
			}
			message
				.removeClass('alert-success')
				.addClass('alert-danger')
				.fadeIn();
			setTimeout(function() {
				message.fadeOut();
			}, 2400);
		};

		// Form On Submit 
		form.on('submit', function(e) {
			e.preventDefault();
			formData = $(this).serialize();
			$.ajax({
				type: 'POST',
				url: form.attr('action'),
				data: formData
			})
			.done(doneFunc)
			.fail(failFunc);
		});
	};

	// Window On Resize
	$(window).on('resize', function() {
		metronal.replaceVHeight(),
		metronal.portfolioFilter.container.isotope('layout');
	});

	// Device Orientation Changes
	window.addEventListener("orientationchange", function () {
        metronal.portfolioFilter.container.isotope('layout');
    }, false);

	// Window On Load
	$(window).on('load', function() {
		metronal.preLoad(800);
	});

	// Document Ready
	$(document).ready(function() {
		metronal.replaceVHeight(),
		metronal.portfolioFilter.init(),
		metronal.pageTransitions(),
		metronal.useMagnificPopup(),
		metronal.setSkillProgress(),
		metronal.progressAnimation(),
		metronal.useTypeIt(),
		metronal.processContactForm();
	});

})(jQuery);