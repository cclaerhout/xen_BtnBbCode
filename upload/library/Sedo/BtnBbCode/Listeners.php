<?php

class Sedo_BtnBbCode_Listeners
{
	public static function parseTagBtn(&$content, array &$options, &$templateName, &$fallBack, array $rendererStates, $parentClass, $bbCodeIdentifier)
	{
		//XenForo 1.1.x compatible code
		if($bbCodeIdentifier != 'sedo_adv_btn')
		{
			return false;
		}
		
		$xenOptions = XenForo_Application::get('options');
		$visitor = XenForo_Visitor::getInstance();

		$model = null;
		$color = null;
		$url = null;
		$target = '_blank';
		
		$hasUrl = null;
		$fallbackOption = null;
		$blockAlign = null;

		foreach($options as $option)
		{
			$_option = BBM_Helper_BbCodes::cleanOption($option, true);

			if(strpos($_option, 'mod') === 0)
			{
				if( !empty($_option[3]) && in_array($_option[3], array('a', 'b', 'c', 'd', 'e', 'f')) )
				{
					$model = 'mod'.$_option[3];
				}
			}
			elseif(preg_match(BBM_Helper_BbCodes::$colorRegex, $_option, $match))
			{
				$model = 'cstm';
				$color = $match[0];
			}
			elseif($_option == 'url')
			{
				//If the url is not recognized by the regex
				$hasUrl = true;

			}
			elseif($_option == 'self')
			{
				$target = 'self';
			}
			elseif(preg_match(BBM_Helper_BbCodes::$regexUrl, $_option))
			{
				$hasUrl = true;
				$url = $_option;
			}
			elseif($option == 'bleft')
			{
				$blockAlign = 'bleft';
			}
			elseif($option == 'bcenter')
			{
				$blockAlign = 'bcenter';
			}
			elseif($option == 'bright')
			{
				$blockAlign = 'bright';
			}
			elseif(!empty($_option))
			{
				$fallbackOption = $_option;
			}		
		}
		
		if($model == null && $color == null)
		{
			$model = 'moda';
		}

		if($hasUrl && $url == null && $fallbackOption)
		{
			$url = $fallbackOption;
		}

		$options['model'] = $model;
		$options['inlineCss'] = ($color == null) ? null : "style='background-color:{$color}'";
		$options['url'] = $url;
		$options['target'] = ($target == 'self') ? '' : 'target="_blank"';
		$options['blockAlign'] = $blockAlign;
	}

	public static function mceConfig($mceConfigObj)
	{
		if($mceConfigObj->hasMenu('adv_insert'))
		{
			$mceConfigObj->addMenuItem('bbm_sedo_adv_btn', 'adv_insert', '@adv_insert_3');
		}
		else
		{
			$mceConfigObj->addMenuItem('bbm_sedo_adv_btn', 'insert', '@insert_2');
		}
	}	
}
//Zend_Debug::dump($abc);