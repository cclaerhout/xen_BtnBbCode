xenMCE.Templates.Bbm_adv_button = {
	onafterload: function($ovl, data, ed, parentClass)
	{
		var $inputText = $ovl.find('input[name=text]'),
			$inputStyle = $ovl.find('input[name=style]'),
			$inputBgcolor = $ovl.find('input[name=style_bgcolor]'),
			$inputColor = $ovl.find('input[name=style_color]'),
			$inputColorModel = $ovl.find('input[name=style_color_model]'),
			inputTextDefaultVal = '...',
			inputTextVal = $inputText.val(),
			$buttons = $ovl.find('.bbm_button'),
			$custButton = $ovl.find('.bbm_button.adv_cstm'),
			$textColor = $ovl.find('.FontColor'),
			whiteHex = 'FFFFFF',
			blackHex = '000000';
		
		if(inputTextVal && inputTextVal != inputTextDefaultVal){
			$buttons.text(inputTextVal);
		}

		var rgb2hex = function(rgb) {
			if (rgb.search("rgb") == -1) {
				return rgb;
			} else {
				rgb = rgb.match(/^rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*(\d+))?\)$/);
				function hex(x) {
					return ("0" + parseInt(x).toString(16)).slice(-2);
				}
				return "#" + hex(rgb[1]) + hex(rgb[2]) + hex(rgb[3]); 
			}
		};
		
		var strip_diese = function(hex){
			return hex.replace('#', '');
		};
		
		var tagActiveBtn = function($target){
			var bgcolor = $target.css('backgroundColor'),
				hex = whiteHex;
			
			if(typeof bgcolor !== 'undefined' && bgcolor != 'transparent'){
				hex = strip_diese(rgb2hex(bgcolor));			
			}

			var hsb = $.colpickHexToHsb(hex), color = blackHex;

			if(hsb.b < 50 && bgcolor != 'transparent'){
				color = whiteHex;
			}

			$('<i class="mce-ico mce-i-selected"></i>').css('color', '#'+color).prependTo($target);
		};

		/* Custom Button */
		var colorEvButton = function(hsb,hex,rgb, $el){
       			var bgcolor = '#'+hex,
      				color = blackHex;

			if(hsb.b < 50){
				color = whiteHex;
			}
				
      			$custButton.css({
      				'backgroundColor': bgcolor,
      				'color': '#'+color
      			}).find('i').css('color', '#'+color);
      				
      			$inputBgcolor.val(bgcolor);
      		};

      		$custButton.colpick({
      			colorScheme:'dark',
      			layout:'hex',
      			color:'ff8800',
      			onChange:function(hsb,hex,rgb,el,bySetColor) {
       				var $el = $(el);
       				colorEvButton(hsb,hex,rgb,$el);   			
      			},
      			onSubmit:function(hsb,hex,rgb,el) {
       				var $el = $(el);
       				colorEvButton(hsb,hex,rgb,$el);
      				$el.colpickHide();
      			},
      			onShow: function(el){
      				var $el = $(el),
      					h = $el.height() + $custButton.height() + 20;
      
      				$el.css({
      					zIndex: 65550,
      					top: '-='+h
      				});
      			}
      		});

		/* Text Color */
		var colorEvText = function(hsb,hex,rgb, $el){
      			var $activeBtn = $ovl.find('.bbm_button.active'),
      				color = '#'+hex;

      			$activeBtn.css('color', color);
      			$inputColor.val(color);
      			$inputColorModel.val($activeBtn.data('model'));		
		};
		
		$textColor.colpick({
      			colorScheme:'dark',
      			layout:'hex',
      			color:'ff8800',
      			onSubmit:function(hsb,hex,rgb,el) {
				var $el = $(el);
				colorEvText(hsb,hex,rgb,$el);
      				$el.colpickHide();
      			},
      			onChange:function(hsb,hex,rgb,el,bySetColor) {
				var $el = $(el);
				colorEvText(hsb,hex,rgb,$el);
      			},
      			onShow: function(el){
      				var $el = $(el),
      					$activeBtn = $ovl.find('.bbm_button.active'),
      					h = $el.height() + $custButton.height() + 20,
      					w = $buttons.width();
      
				if(!$activeBtn.length){
					var alert = $textColor.data('alert') || '';
					ed.windowManager.alert(alert);
					return false;
				}

      				$el.css({
      					zIndex: 65550,
      					top: '-='+h,
      					left: '+='+w,
      				});
      			}
      		});
		
		/* Input Text Management */
		$inputText.on('change, keydown, keyup', function(e){
			var val = $(this).val();
			if(val){
				$buttons.text(val);
			} else {
				$buttons.each(function(){
					var $this = $(this);
					$this.text($this.data('phrase'));
				});
			}

			tagActiveBtn($ovl.find('.bbm_button.active'));
		})
		.one('click', function(){
			var $this = $(this);
			if($this.val() == inputTextDefaultVal){
				$this.val('');
			}
		});

		/* Button style Management*/	
		$buttons.click(function(){
			var $button = $(this);
			$buttons.removeClass('active');
			$buttons.children('i').remove();
			$button.addClass('active');
			tagActiveBtn($button);
			$inputStyle.val($button.data('model'));
		});	
	},
	submit: function(e, $ovl, ed, parentClass)
	{
		var tag = parentClass.bbm_tag,
			separator = parentClass.bbm_separator;
		
		var data = e.data,
			blockalign = data.blockalign, //done
			btnBlock = parseInt(data.btnBlock), //done
			style = data.style, // done
			style_bgcolor = data.style_bgcolor, //done
			style_color = data.style_color, // done
			style_color_model = data.style_color_model, //done
			text = data.text, //done
			url = data.url, //done
			urlHref = parseInt(data.urlHref); //done

		/* Options Management */
		var options = [];

		if(style.length){
			if(style == 'cstm' && style_bgcolor.length){
				options.push(style_bgcolor);
			} else if (style != 'cstm'){
				options.push(style);			
			}
		}

		if(btnBlock){
			options.push(blockalign);
		}
		
		if(url.length){
			options.push(url);
			
			if(urlHref){
				options.push('self');				
			}
		}

		/* Content Management */
		var content = parentClass.escapeHtml(text);

		if(style_color_model == style){
			content = '<span style="color: '+style_color+';">'+content+'</span>';
		}
		
		/* Output Management */
		options = options.join(separator);
		parentClass.insertBbCode(tag, options, content);

		return;
	},
	onclose: function(e, $ovl, ed, parentClass)
	{
		//Remove all instance of color pickers
		$ovl.find('.custColorPicker').each(function(){
			var colpickId = $(this).data('colpickId');
			
			if(!colpickId) return;
			
			$('#'+colpickId).remove();
		});
	}
}