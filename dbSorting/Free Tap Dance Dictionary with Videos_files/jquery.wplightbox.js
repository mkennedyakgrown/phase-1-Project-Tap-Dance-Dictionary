
(function($){jQuery.fn.wplightbox=function(settings){settings=jQuery.extend({bShowToolTip:false,strCloseToolTip:'Close (Esc)',strPrevToolTip:'Previous (<)',strNextToolTip:'Next (>)',strPlayToolTip:'Play',strPauseToolTip:'Pause',bBkgrndClickable:true,strBkgrndCol:'#000000',nBkgrndOpacity:0.5,strContentCol:'#ffffff',nContentOpacity:0.8,strCaptionCol:'#555555',nCaptionOpacity:1.0,nCaptionType:1,bCaptionCount:true,strCaptionFontType:'Tahoma,Serif',strCaptionFontCol:'#ffffff',nCaptionFontSz:15,bShowPlay:true,bAnimateOpenClose:true,nPlayPeriod:2000,loadBtnSrc:'',blankSrc:'',playBtnSrc:'',playOverBtnSrc:'',pauseBtnSrc:'',pauseOverBtnSrc:'',closeBtnSrc:'',closeOverBtnSrc:'',nextBtnSrc:'',nextOverBtnSrc:'',prevBtnSrc:'',prevOverBtnSrc:'',border_n:'',border_e:'',border_s:'',border_w:'',border_ne:'',border_nw:'',border_se:'',border_sw:'',nZIndex:151,nPlayBtnOffset:18,nNextBtnSz:35,nLoadBtnSz:50,nPlayBtnSz:40,nBtnOffset:10,nTableBorderSz:10,nCaptionPadding:15,nCaptionOffset:10,bShowTranspBkgrndDiv:true},settings);var eContent={Image:0,Iframe:1,Flash:2,QuickTime:3};var eCaption={NoCaption:0,ExternalDivBottom:1,ExternalDivTop:2};var eMouseOver={None:0,Next:1,Prev:2};var m_nContentType=eContent.Image;var m_AnchorArray=[];var m_nArrayPos=0;var m_nArraySize=0;var $m_BackgroundDiv=null;var $m_Table=null;var $m_Content=null;var $m_ContentContainer=null;var $m_CloseDiv=null;var $m_NextDiv=null;var $m_PrevDiv=null;var $m_PlayDiv=null;var $m_CaptionContainer=null;var $m_Caption=null;var m_strCloseTitle=settings.bShowToolTip?'title="'+settings.strCloseToolTip+'"':'';var m_strPrevTitle=settings.bShowToolTip?'title="'+settings.strPrevToolTip+'"':'';var m_strNextTitle=settings.bShowToolTip?'title="'+settings.strNextToolTip+'"':'';var m_strPlayTitle=settings.bShowToolTip?'title="'+settings.strPlayToolTip+'"':'';var m_bResizing=false;var m_bClosing=false;var m_nResizeStep=0;var m_nResizeTimerId=0;var m_bChangingContent=false;var m_bSingleItem=false;var m_strSource;var m_strCaption;var m_nContentWidth=0;var m_nContentHeight=0;var m_nContentLeft=0;var m_nContentTop=0;var m_nOldContentWidth=m_nContentWidth;var m_nOldContentHeight=m_nContentHeight;var m_nOldContentLeft=m_nContentLeft;var m_nOldContentTop=m_nContentTop;var m_nDefaultWidth=600;var m_nDefaultHeight=400;var m_nCaptionHeight=settings.nCaptionFontSz+settings.nCaptionPadding;var m_bPlaying=false;var m_nPlayTimerId=0;this.click(function(){if(!$m_Table){Initialise(this);}return false;});function Initialise(anchor){m_nContentWidth=200;m_nContentHeight=200;m_nContentLeft=GetContentLeft();m_nContentTop=GetContentTop();StoreOldDimensions();var imgLoad=new Image();imgLoad.src=settings.loadBtnSrc;if(settings.bShowTranspBkgrndDiv){$('body').append('<div id="wplightbox_bkgrnd" style="position:absolute; top:0px; left:0px; width:'+GetPageWidth()+'px; height:'+GetPageHeight()+'px; background-color:'+settings.strBkgrndCol+'; z-index:'+settings.nZIndex+'; overflow: hidden;"></div>');$('#wplightbox_bkgrnd').css('opacity',settings.nBkgrndOpacity);$m_BackgroundDiv=$('#wplightbox_bkgrnd');}var strTable='<table id="wplightbox_table" cellpadding="0" cellspacing="0" style="margin: auto 0px; text-align:center; vertical-align:middle; position:absolute; top:'+(GetContentTop()-settings.nTableBorderSz)+'px; left:'+(GetContentLeft()-settings.nTableBorderSz)+'px; width:'+(m_nContentWidth+(settings.nTableBorderSz*2))+'px; height:'+(m_nContentHeight+(settings.nTableBorderSz*2))+'px; z-index:'+(settings.nZIndex+1)+'; display:none;">'+'<tbody>'+'<tr style="height:'+settings.nTableBorderSz+'px;">'+'<td id="nw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_nw+'); background-repeat:no-repeat;"></td>'+'<td id="n" style=background-image:url('+settings.border_n+'); background-repeat:repeat-x;"></td>'+'<td id="ne" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_ne+'); background-repeat:no-repeat;"></td>'+'</tr>'+'<tr>'+'<td id="w" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_w+'); background-repeat:repeat-y;"></td>'+'<td id="wplightbox_contentcol" style="background-color:'+settings.strContentCol+';"><img id="wplightbox_content" src="'+settings.loadBtnSrc+'" style="border:1px #000000;"/></td>'+'<td id="e" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_e+'); background-repeat:repeat-y;"></td>'+'</tr>'+'<tr style="height:'+settings.nTableBorderSz+'px;">'+'<td id="sw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_sw+'); background-repeat:no-repeat;"></td>'+'<td id="s" style=background-image:url('+settings.border_s+'); background-repeat:repeat-x;"></td>'+'<td id="se" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_se+'); background-repeat:no-repeat;"></td>'+'</tr>'+'</tbody>'+'</table>';$('body').append(strTable);$m_Table=$('#wplightbox_table');$m_ContentContainer=$('#wplightbox_contentcol');$m_Content=$('#wplightbox_content');$('body').append('<div id="wplightbox_closediv" '+m_strCloseTitle+' style="position:absolute; top:'+(GetContentTop()-settings.nTableBorderSz-(settings.nNextBtnSz/2))+'px; left:'+(GetContentLeft()-settings.nTableBorderSz+m_nContentWidth-(settings.nNextBtnSz/2))+'px; width:'+settings.nNextBtnSz+'px; height:'+settings.nNextBtnSz+'px; z-index:'+(settings.nZIndex+5)+'; cursor:pointer; border-style:none; background-image:url('+settings.closeBtnSrc+'); background-repeat:no-repeat;"></div>');$m_CloseDiv=$('#wplightbox_closediv');$('body').append('<div id="wplightbox_nextdiv" '+m_strNextTitle+' style="position:absolute; top:'+(GetContentTop()+m_nContentHeight)+'px; left:'+(GetContentLeft()+m_nContentWidth+settings.nNextBtnSz)+'px; width:'+settings.nNextBtnSz+'px; height:'+settings.nNextBtnSz+'px; z-index:'+(settings.nZIndex+5)+'; cursor:pointer; border-style:none; background-image:url('+settings.nextBtnSrc+'); background-repeat:no-repeat; display:none;"></div>');$('body').append('<div id="wplightbox_prevdiv" '+m_strPrevTitle+' style="position:absolute; top:'+(GetContentTop()+m_nContentHeight)+'px; left:'+(GetContentLeft()-(settings.nNextBtnSz*2))+'px; width:'+settings.nNextBtnSz+'px; height:'+settings.nNextBtnSz+'px; z-index:'+(settings.nZIndex+5)+'; cursor:pointer; border-style:none; background-image:url('+settings.prevBtnSrc+'); background-repeat:no-repeat; display:none;"></div>');$m_NextDiv=$('#wplightbox_nextdiv');$m_PrevDiv=$('#wplightbox_prevdiv');if(settings.bShowPlay){$('body').append('<div id="wplightbox_playdiv" '+m_strPlayTitle+' style="position:absolute; top:'+(GetContentTop()+m_nContentHeight-(settings.nPlayBtnSz+settings.nPlayBtnOffset))+'px; left:'+(GetContentLeft()+m_nContentWidth-(settings.nPlayBtnSz+settings.nPlayBtnOffset))+'px; width:'+settings.nPlayBtnSz+'px; height:'+settings.nPlayBtnSz+'px; z-index:'+(settings.nZIndex+2)+'; cursor:pointer; border-style:none; background-image:url('+settings.playBtnSrc+'); background-repeat:no-repeat; display:none;"></div>');$m_PlayDiv=$('#wplightbox_playdiv');}InitCaption();if(settings.bShowTranspBkgrndDiv&&settings.bBkgrndClickable){$m_BackgroundDiv.click(function(){StartClose();return false;});}$(window).bind('resize',function(){m_nContentLeft=GetContentLeft();m_nContentTop=GetContentTop();if(settings.bShowTranspBkgrndDiv){$m_BackgroundDiv.css({'width':GetPageWidth(),'height':GetPageHeight(),'overflow':'hidden'});}if($m_CaptionContainer){$m_CaptionContainer.remove();$m_CaptionContainer=null;}$m_Table.remove();$('body').append(strTable);$m_Table=$('#wplightbox_table');$m_ContentContainer=$('#wplightbox_contentcol');$m_Content=$('#wplightbox_content');$m_Content.attr({'src':m_strSource,'width':m_nContentWidth,'height':m_nContentHeight});$m_Content.css('display','block');$m_Table.css({'left':(m_nContentLeft-settings.nTableBorderSz),'top':(m_nContentTop-settings.nTableBorderSz),'width':(m_nContentWidth+(settings.nTableBorderSz*2)),'height':(m_nContentHeight+(settings.nTableBorderSz*2))});$m_Table.show();InitCaption();SetCaptionText(true);SetCaptionPosition();ShowCaption(HasCaption());PositionCloseBtn();if(settings.bShowPlay){PositionPlayBtn();}PositionNextAndPrevBtn();ShowImg();});var options=$(anchor).data('lightbox');if(!options.width)options.width=m_nDefaultWidth;if(!options.height)options.height=m_nDefaultHeight;if(m_nArraySize>0){m_AnchorArray=[];}m_nArrayPos=0;if(options.galleryId==='wplightbox'){m_nArraySize=1;m_AnchorArray[m_nArrayPos]=anchor;if(settings.bAnimateOpenClose){GetPositionFromAnchor($(anchor),true);}Load(anchor,true);RegisterEvents(true);$m_Table.show();}else
{var nCount=0;var objects='a';if(anchor.localName=="area")objects='area';$(objects).each(function(){if(this.getAttribute('data-lightbox')){var tmpOptions=$(this).data('lightbox');if(options.galleryId===tmpOptions.galleryId){var map=jQuery("map",this);if(map.size()<1){m_AnchorArray[nCount]=this;++nCount;}}}});m_nArraySize=nCount;m_bSingleItem=(m_nArraySize<2);for(nCount=0;nCount<m_nArraySize;++nCount){if(m_AnchorArray[nCount].href===anchor.href&&m_AnchorArray[nCount].getAttribute('data-lightbox')===anchor.getAttribute('data-lightbox')){m_nArrayPos=nCount;}}if(settings.bAnimateOpenClose){GetPositionFromAnchor($(m_AnchorArray[m_nArrayPos]),true);}Load(m_AnchorArray[m_nArrayPos],m_bSingleItem);RegisterEvents(m_bSingleItem);$m_Table.show();}}function GetPositionFromAnchor(objAnchor,bStart){var img=jQuery("img",objAnchor);if(img.size()<1){if($(objAnchor).is("area")){var map=$(objAnchor).parent();if(map!==undefined){$("body").find("img").each(function(){if($(this).attr("usemap")==="#"+$(map).attr("id"))img=$(this);});}}}if(img.size()>0){var imgOffset=img.offset();m_nContentLeft=imgOffset.left;m_nContentTop=imgOffset.top;m_nContentWidth=img.width();m_nContentHeight=img.height();}else
{m_nContentLeft=-1;m_nContentTop=-1;m_nContentWidth=-1;m_nContentHeight=-1;$(objAnchor).find('*').each(function(){if(m_nContentLeft===-1||m_nContentLeft>$(this).offset().left)m_nContentLeft=$(this).offset().left;if(m_nContentTop===-1||m_nContentTop>$(this).offset().top)m_nContentTop=$(this).offset().top;if(m_nContentWidth===-1||m_nContentWidth<$(this).width())m_nContentWidth=$(this).width();if(m_nContentHeight===-1||m_nContentHeight>$(this).height())m_nContentHeight=$(this).height();});}if(bStart){$m_Table.css({'left':(m_nContentLeft-settings.nTableBorderSz),'top':(m_nContentTop-settings.nTableBorderSz),'width':(m_nContentWidth+(settings.nTableBorderSz*2)),'height':(m_nContentHeight+(settings.nTableBorderSz*2))});}}function Load(objAnchor,bSingleItem){var bItemLoaded=false;m_bSingleItem=bSingleItem;var options=$(objAnchor).data('lightbox');m_strCaption=options.caption?options.caption:'';if(!options.width)options.width=m_nDefaultWidth;if(!options.height)options.height=m_nDefaultHeight;m_strSource=objAnchor.href;if(!m_strSource.length){var parentDiv=$(objAnchor).parent('div');if(parentDiv.size()>0){var area=jQuery('area',parentDiv);if(area.size()>0){m_strSource=area[0].href;}}}SetContentToImage();var urlType=m_strSource.toLowerCase().slice(m_strSource.lastIndexOf('.'));m_nContentType=eContent.Iframe;switch(urlType){case'.jpg':case'.jpeg':case'.png':case'.gif':case'.bmp':case'.svg':case'.webp':m_nContentType=eContent.Image;break;case'.swf':m_nContentType=eContent.Flash;break;case'.mov':m_nContentType=eContent.QuickTime;break;}if(m_nContentType!==eContent.Image){GetDimensions(objAnchor);}HideControls();if(m_nContentType===eContent.Image){var image=new Image();image.onload=function(){bItemLoaded=true;image.onload=null;StoreOldDimensions();m_nContentWidth=image.width;m_nContentHeight=image.height;if(options.width&&options.height){if(image.width>options.width||image.height>options.height){var aspect=image.width/image.height;if(options.width>options.height){m_nContentWidth=options.height*aspect;m_nContentHeight=options.height;}else
{m_nContentWidth=options.width;m_nContentHeight=options.width/aspect;}}}if(settings.nCaptionType===eCaption.ExternalDivTop){SetCaptionText(true);SetCaptionPosition();}m_nContentLeft=GetContentLeft();m_nContentTop=GetContentTop();StartResize();};image.src=m_strSource;}else{StartResize();}}function ShowImg(){StopResize();switch(m_nContentType){case eContent.Image:$m_ContentContainer.append('<img id="wplightbox_content" src="'+settings.blankSrc+'" style="border:1px #000000;"/>');break;case eContent.Iframe:$m_ContentContainer.append('<iframe id="wplightbox_content" src="'+settings.blankSrc+'" frameborder=0 style="border:1px #000000;"/>');break;case eContent.QuickTime:var strObject='<div id="wplightbox_content" style="z-index:'+(settings.nZIndex+1)+';"><object classid="CLSID:02BF25D5-8C17-4B23-BC80-D3488ABDDC6B" '+'codebase="http://www.apple.com/qtactivex/qtplugin.cab" '+'standby="Loading Player..." '+'type="application/x-oleobject" '+'id="wplightbox_quicktime" '+'width="'+m_nContentWidth+'px" '+'height="'+m_nContentHeight+'px">'+'<param name="src" value="'+m_strSource+'"/>'+'<param name="autoplay" value="true"/>'+'<param name="loop" value="true"/>'+'<embed src="'+m_strSource+'" '+'autoplay="true" '+'loop="true" '+'type="video/quicktime" '+'pluginspage="http://www.apple.com/quicktime/" '+'width="'+m_nContentWidth+'px" '+'height="'+m_nContentHeight+'px"></embed>'+'</object></div>';$m_ContentContainer.append(strObject);StopPlayTimer();break;case eContent.Flash:if(DetectFlashVer(8,0,0)){var strFlashObject='<div id="wplightbox_content"><object classid="clsid:d27cdb6e-ae6d-11cf-96b8-444553540000" '+'codebase="http://fpdownload.macromedia.com/get/flashplayer/current/swflash.cab" '+'id="wplightbox_flashobj" '+'width="'+m_nContentWidth+'px" '+'height="'+m_nContentHeight+'px">'+'<param name="movie" value="'+m_strSource+'"/>'+'<param name="quality" value="high"/>'+'<embed src="'+m_strSource+'" '+'quality="high" '+'type="application/x-shockwave-flash" '+'pluginspage="http://www.macromedia.com/go/getflashplayer" '+'width="'+m_nContentWidth+'px" '+'height="'+m_nContentHeight+'px"></embed>'+'</object></div>';$m_ContentContainer.append(strFlashObject);}else{$m_ContentContainer.append('<div id="wplightbox_content" frameborder=0 style="border:1px #000000;"/>An old version of the Flash plugin was detected. <strong><a href="http://www.macromedia.com/go/getflash/">Please upgrade your Flash plugin.<\/a><\/strong><\/div>');}StopPlayTimer();break;}$m_Content.remove();$m_Content=$('#wplightbox_content');$m_Content.attr({'src':m_strSource});$m_Content.attr({'width':m_nContentWidth,'height':m_nContentHeight});$m_Content.css('display','block');$m_Content.animate({opacity:1.0},10,function(){$m_ContentContainer.animate({'opacity':1.0},100,function(){m_bChangingContent=false;PositionCloseBtn();$m_CloseDiv.show();if(!m_bSingleItem){if(settings.bShowPlay){PositionPlayBtn();$m_PlayDiv.show();}PositionNextAndPrevBtn();$m_NextDiv.show();$m_PrevDiv.show();}});});ShowCaption(HasCaption());}function GetDimensions(objAnchor){if(objAnchor){StoreOldDimensions();var options=$(objAnchor).data('lightbox');m_nContentWidth=(options.width)?(options.width):m_nDefaultWidth;m_nContentHeight=(options.height)?(options.height):m_nDefaultHeight;m_nContentLeft=GetContentLeft();m_nContentTop=GetContentTop();}}function StartResize(){if(!m_bResizing){m_bResizing=true;m_nResizeStep=0;m_nResizeTimerId=setInterval(OnResize,12);}}function SetContentToImage(){if(m_nContentType!==eContent.Image){$m_Content.remove();$m_ContentContainer.append('<img id="wplightbox_content" src="'+settings.loadBtnSrc+'" style="width='+settings.nLoadBtnSz+'px; height='+settings.nLoadBtnSz+'px; border:1px #000000;"/>');$m_Content=$('#wplightbox_content');}}function StopResize(){if(m_bResizing){m_bResizing=false;clearInterval(m_nResizeTimerId);}}function OnResize(){if(!settings.bAnimateOpenClose){m_nResizeStep=14;}m_nResizeStep+=1;var nProgress=(m_nResizeStep/15);var nTop=Math.round(m_nOldContentTop+(m_nContentTop-m_nOldContentTop)*nProgress);var nLeft=Math.round(m_nOldContentLeft+(m_nContentLeft-m_nOldContentLeft)*nProgress);var nWidth=Math.round(m_nOldContentWidth+(m_nContentWidth-m_nOldContentWidth)*nProgress);var nHeight=Math.round(m_nOldContentHeight+(m_nContentHeight-m_nOldContentHeight)*nProgress);var nTableLeft=nLeft-settings.nTableBorderSz;var nTableTop=nTop-settings.nTableBorderSz;var nTableWidth=nWidth+(settings.nTableBorderSz*2);var nTableHeight=nHeight+(settings.nTableBorderSz*2);$m_Table.css({'left':nTableLeft,'top':nTableTop,'width':nTableWidth,'height':nTableHeight});if(m_nResizeStep>=15){if(m_bClosing){Close();}else
{ShowImg();}}}function StartPlayTimer(){if(!m_bPlaying){m_bPlaying=true;if(settings.bShowToolTip){$m_PlayDiv.attr({'title':settings.strPauseToolTip});}$m_PlayDiv.css({'backgroundImage':'url('+settings.pauseBtnSrc+')'});OnPlayTimer();m_nPlayTimerId=setInterval(OnPlayTimer,settings.nPlayPeriod);}}function StopPlayTimer(){if(m_bPlaying){m_bPlaying=false;if(settings.bShowToolTip){$m_PlayDiv.attr({'title':settings.strPlayToolTip});}$m_PlayDiv.css({'backgroundImage':'url('+settings.playBtnSrc+')'});clearInterval(m_nPlayTimerId);}}function OnPlayTimer(){Next(false);}function HideControls(){$m_Content.attr({'src':settings.loadBtnSrc,'width':settings.nLoadBtnSz,'height':settings.nLoadBtnSz});$m_Content.css('display','inline');$m_ContentContainer.css({'opacity':settings.nContentOpacity});$m_CloseDiv.hide();ShowCaption(false);if(!m_bSingleItem){if(settings.bShowPlay){$m_PlayDiv.hide();}}}function StartClose(){if(!m_bClosing){m_bClosing=true;if(settings.bAnimateOpenClose){HideControls();StoreOldDimensions();SetContentToImage();GetPositionFromAnchor($(m_AnchorArray[m_nArrayPos]),false);StartResize();}else{Close();}}}function Close(){if(settings.bAnimateOpenClose){StopResize();}m_bClosing=false;$(document).unbind('keyup');$(window).unbind('resize');$("#wplightbox_bkgrnd").unbind("click");$("#wplightbox_close").unbind("click");if($m_CaptionContainer){$m_CaptionContainer.remove();$m_CaptionContainer=null;}$m_Table.remove();$m_CloseDiv.remove();if(!m_bSingleItem){$("#wplightbox_next").unbind("click");$("#wplightbox_prev").unbind("click");$m_NextDiv.remove();$m_PrevDiv.remove();if(settings.bShowPlay){StopPlayTimer();$m_PlayDiv.unbind("click");$m_PlayDiv.remove();}}if(settings.bShowTranspBkgrndDiv){$m_BackgroundDiv.animate({'opacity':0.0},300,function(){$('#wplightbox_bkgrnd').remove();m_nContentWidth=200;m_nContentHeight=200;});}$m_Table=null;$m_CloseDiv=null;$m_NextDiv=null;$m_PrevDiv=null;$m_PlayDiv=null;$m_BackgroundDiv=null;}function Next(bStopPlayTimer){if(!m_bChangingContent){if(bStopPlayTimer){StopPlayTimer();}m_bChangingContent=true;++m_nArrayPos;if(m_nArrayPos>=m_nArraySize){m_nArrayPos=0;}Load(m_AnchorArray[m_nArrayPos],false);}}function Prev(){if(!m_bChangingContent){StopPlayTimer();m_bChangingContent=true;--m_nArrayPos;if(m_nArrayPos<0){m_nArrayPos=m_nArraySize-1;}Load(m_AnchorArray[m_nArrayPos],false);}}function RegisterEvents(bSingleItem){$(document).bind('keyup',function(e){var keycode=(e===null)?event.keyCode:e.which;if(bSingleItem){if(keycode===27){StartClose();}}else{switch(keycode){case 27:StartClose();break;case 190:case 39:Next(true);break;case 188:case 37:Prev();break;}}});$m_CloseDiv.click(function(){StartClose();});$m_CloseDiv.hover(function(){$(this).css({'backgroundImage':'url('+settings.closeOverBtnSrc+')'});},function(){$(this).css({'backgroundImage':'url('+settings.closeBtnSrc+')'});});if(!bSingleItem){if(settings.bShowPlay&&!m_bSingleItem){$m_PlayDiv.click(function(){if(!m_bPlaying){StartPlayTimer();}else
{StopPlayTimer();}});}$m_PrevDiv.click(function(){Prev();});$m_NextDiv.click(function(){Next(true);});$m_PrevDiv.hover(function(){$(this).css({'backgroundImage':'url('+settings.prevOverBtnSrc+')'});},function(){$(this).css({'backgroundImage':'url('+settings.prevBtnSrc+')'});});$m_NextDiv.hover(function(){$(this).css({'backgroundImage':'url('+settings.nextOverBtnSrc+')'});},function(){$(this).css({'backgroundImage':'url('+settings.nextBtnSrc+')'});});if(settings.bShowPlay){$m_PlayDiv.hover(function(){if(m_bPlaying){$(this).css({'backgroundImage':'url('+settings.pauseOverBtnSrc+')'});}else
{$(this).css({'backgroundImage':'url('+settings.playOverBtnSrc+')'});}},function(){if(m_bPlaying){$(this).css({'backgroundImage':'url('+settings.pauseBtnSrc+')'});}else
{$(this).css({'backgroundImage':'url('+settings.playBtnSrc+')'});}});}}}function PositionNextAndPrevBtn(){var nTopPos=m_nContentTop+(m_nContentHeight/2)-(settings.nNextBtnSz/2);$m_NextDiv.css({'left':(m_nContentLeft+m_nContentWidth-3+settings.nBtnOffset),'top':nTopPos});$m_PrevDiv.css({'left':(m_nContentLeft-settings.nNextBtnSz-settings.nBtnOffset),'top':nTopPos});}function PositionCloseBtn(){var nTop=m_nContentTop-settings.nNextBtnSz-settings.nBtnOffset;if(settings.nCaptionType===eCaption.ExternalDivTop&&HasCaption()){nTop-=$m_CaptionContainer.height();}$m_CloseDiv.css({'left':(m_nContentLeft+m_nContentWidth-settings.nNextBtnSz),'top':nTop});}function PositionPlayBtn(){$m_PlayDiv.css({'left':(m_nContentLeft+m_nContentWidth-(settings.nPlayBtnSz+settings.nPlayBtnOffset)),'top':(m_nContentTop+m_nContentHeight-(settings.nPlayBtnSz+settings.nPlayBtnOffset))});}function GetContentLeft(){return Math.max(0,($(window).width()-m_nContentWidth)/2);}function GetContentTop(){if(settings.nCaptionType===eCaption.ExternalDivTop){if($m_CaptionContainer&&HasCaption()){var nCaptionHt=GetCaptionHeight();return Math.max((settings.nNextBtnSz+settings.nBtnOffset+GetCaptionHeight()),(GetPageScrollY()+(Math.min(($(window).height()/10)+nCaptionHt,(($(window).height()-(m_nContentHeight+20-nCaptionHt))/2)))));}else
{return Math.max((settings.nNextBtnSz+settings.nBtnOffset),(GetPageScrollY()+(Math.min(($(window).height()/10)+((settings.nTableBorderSz*2)+m_nCaptionHeight),(($(window).height()-(m_nContentHeight+20+((settings.nTableBorderSz*2)+m_nCaptionHeight)))/2)))));}}else{return Math.max((settings.nNextBtnSz+settings.nBtnOffset),(GetPageScrollY()+(Math.min(($(window).height()/10),(($(window).height()-(m_nContentHeight+20))/2)))));}}function GetPageWidth(){var nPageWidth=Math.max($(window).width(),$(document).width());nPageWidth=Math.max(nPageWidth,(m_nContentWidth+40));return nPageWidth;}function GetPageHeight(){var nPageHeight=Math.max($(window).height(),$(document).height());nPageHeight=Math.max(nPageHeight,(GetContentTop()+m_nContentHeight+100));return nPageHeight;}function GetPageScrollY(){var yScroll=0;if(window.pageYOffset){yScroll=window.pageYOffset;}else if(document.body&&document.body.scrollTop){yScroll=document.body.scrollTop;}else if(document.documentElement&&document.documentElement.scrollTop){yScroll=document.documentElement.scrollTop;}else if(window.scrollY){yScroll=window.scrollY;}return yScroll;}function StoreOldDimensions(){m_nOldContentWidth=m_nContentWidth;m_nOldContentHeight=m_nContentHeight;m_nOldContentTop=m_nContentTop;m_nOldContentLeft=m_nContentLeft;}function InitCaption(){if($m_CaptionContainer){return;}switch(settings.nCaptionType){case eCaption.ExternalDivBottom:case eCaption.ExternalDivTop:var strCaptionTable='<table id="wplightbox_captiontable" cellpadding="0" cellspacing="0" style="margin: auto 0px; text-align:center; vertical-align:middle; position:absolute; top:'+(GetContentTop()+(settings.nTableBorderSz*2)+m_nContentHeight)+'px; left:'+(GetContentLeft()-settings.nTableBorderSz)+'px; width:'+(m_nContentWidth+(settings.nTableBorderSz*2))+'px; height:'+m_nCaptionHeight+'px; z-index:'+(settings.nZIndex+3)+';">'+'<tbody>'+'<tr style="height:'+settings.nTableBorderSz+'px;">'+'<td id="cnw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_nw+'); background-repeat:no-repeat;"></td>'+'<td id="cn" style=background-image:url('+settings.border_n+'); background-repeat:repeat-x;"></td>'+'<td id="cne" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_ne+'); background-repeat:no-repeat;"></td>'+'</tr>'+'<tr style="height:'+m_nCaptionHeight+'px;">'+'<td id="cw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_w+'); background-repeat:repeat-y;"></td>'+'<td id="wplightbox_captioncol" style="background-color:'+settings.strCaptionCol+'; padding:'+settings.nCaptionPadding+'px;"><span id="wplightbox_caption" style="font-family:'+settings.strCaptionFontType+'; color:'+settings.strCaptionFontCol+'; font-size:'+settings.nCaptionFontSz+'px; font-weight:normal;">Caption</span></td>'+'<td id="ce" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_e+'); background-repeat:repeat-y;"></td>'+'</tr>'+'<tr style="height:'+settings.nTableBorderSz+'px;">'+'<td id="csw" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_sw+'); background-repeat:no-repeat;"></td>'+'<td id="cs" style=background-image:url('+settings.border_s+'); background-repeat:repeat-x;"></td>'+'<td id="cse" style="width:'+settings.nTableBorderSz+'px; background-image:url('+settings.border_se+'); background-repeat:no-repeat;"></td>'+'</tr>'+'</tbody>'+'</table>';$('body').append(strCaptionTable);$m_CaptionContainer=$('#wplightbox_captiontable');$m_Caption=$('#wplightbox_caption');$('#wplightbox_captioncol').css('opacity',settings.nCaptionOpacity);break;}}function SetCaptionPosition(){switch(settings.nCaptionType){case eCaption.ExternalDivBottom:$m_CaptionContainer.css({'left':(m_nContentLeft-settings.nTableBorderSz),'top':(m_nContentTop+settings.nCaptionOffset+m_nContentHeight),'width':(m_nContentWidth+(settings.nTableBorderSz*2))});break;case eCaption.ExternalDivTop:$m_CaptionContainer.css({'left':(m_nContentLeft-settings.nTableBorderSz),'width':(m_nContentWidth+(settings.nTableBorderSz*2))});var nCaptionHeight=GetCaptionHeight();$m_CaptionContainer.css({'top':(m_nContentTop-(settings.nCaptionOffset+nCaptionHeight))});break;}}function HasCaption(){if(settings.nCaptionType===eCaption.NoCaption){return false;}if(m_strCaption&&m_strCaption.length>0){return true;}if(settings.bCaptionCount&&!m_bSingleItem){return true;}return false;}function SetCaptionText(bShow){if($m_Caption){if(bShow){if(settings.bCaptionCount&&!m_bSingleItem){var nImagePos=m_nArrayPos+1;var strCount=nImagePos+'/'+m_nArraySize+' ';$m_Caption.text(strCount+m_strCaption);}else{$m_Caption.text(m_strCaption);}}else
{$m_Caption.text('');}}}function ShowCaption(bShow){switch(settings.nCaptionType){case eCaption.ExternalDivBottom:case eCaption.ExternalDivTop:if($m_CaptionContainer){if(bShow){SetCaptionText(true);SetCaptionPosition();$m_CaptionContainer.show();}else{SetCaptionText(false);$m_CaptionContainer.hide();}}break;}}function GetCaptionHeight(){$m_CaptionContainer.show();var nCaptionHeight=$m_CaptionContainer.height();$m_CaptionContainer.hide();return nCaptionHeight;}};})(jQuery);