	// Global variables
	var saved = window.localStorage;
	var atkCount;
	var itmCount;
	var splCount;
	var curTab = 'Attacks';

	var skillBonus = [];
	var throwBonus = [];
	var saves = [];
	var atkList = '';
	var itmList = '';
	var splList = '';

	// Load Character data
	loadCharacter();

	// When user closes window, the character content is saved.
	$(window).on("unload", function(event) {
		saveCharacter();
	});

	// Skill on click event
	$('.checkSkill').on('click', function(event){
		var skillName = $(this).attr('class').split(' ')[1];
		toggleSkill(skillName);
	});

	$('.checkThrow').on('click', function(event){
		var throwName = $(this).attr('class').split(' ')[1];
		toggleThrow(throwName)
	});

	// Proficiency Bonus
	$('#charProficiency').on('change', function(event){
		// Updates skills with the new proficiency bonus
		updateSkills();
		updateThrows();
	});

	// Stat Block and modifiers
	$('#str').on('change', function(event) {
		$('#strMod').html(getModifier($('#str').val()));
	});

	// Updates skills, uses local storage
	$('.skills').on('change', function(event){
		saved.setItem(''+$(this).attr('id'), $(this).val());
	});

	// Update throws, uses local storage
	$('.throws').on('change', function(event){
		saved.setItem(''+$(this).attr('id'), $(this).val());
	});

	// Stat modifiers
	$('#dex').on('change', function(event) {
		$('#dexMod').html(getModifier($('#dex').val()));
	});

	$('#con').on('change', function(event) {
		$('#conMod').html(getModifier($('#con').val()));
	});

	$('#int').on('change', function(event) {
		$('#intMod').html(getModifier($('#int').val()));
	});

	$('#wis').on('change', function(event) {
		$('#wisMod').html(getModifier($('#wis').val()));
	});

	$('#cha').on('change', function(event) {
		$('#chaMod').html(getModifier($('#cha').val()));
	});
	
	// Death saves
	$('.success').on('click', function(event) {

		checkSuccess($(this).attr('id'));
	});

	$('.failure').on('click', function(event) {

		checkFailure($(this).attr('id'));
	});

	// Spell Slots show/hide
	$('.slots').on('click', function(event) {
		$('.spellSlots').toggle();
		if($(this).html() === '+Spell Slots+')
			$(this).html('- Spell Slots -');
		else
			$(this).html('+Spell Slots+')
	});

	// proficiencies and languages
	$('.prof').on('click', function(event) {
		$('#prof').toggle();
	});

	// Feats and Traits
	$('.feat').on('click', function(event) {
		$('#feat').toggle();
	});
	

	// Adds attack element
	$('.atkBtn').on('click', function(event) {
		var row =	"<div class=\"row\">"
				        +"<button type=\"button\" class=\"btn btn-outline-dark atkRemove\">X</button>"
                        +"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Name\" size=\"8\"></div>"
                        +"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Bonus\" size=\"8\"></div>"
                        +"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Damage\" size=\"8\"></div>"
                    	+"</div>";
		$('.atkContainer').append(row); 
		atkCount += 1;
	});

	// Adds item element
	$('.itmBtn').on('click', function(event) {
		var row =   "<div class=\"row\">"  
		                +"<button type=\"button\" class=\"btn btn-outline-dark itmRemove \">X</button>"
						+"<div class=\"col-sm-6\"><div class=\"col-sm-2\">"
						+"</div><input class=\"itmTable\" type=\"text\" placeholder=\"Name\" size=\"8\"></div>"
                        +"<div class=\"col-sm-3\"><input class=\"itmTable\" type=\"text\" placeholder=\"#\" size=\"4\"></div>"
                        +"<div class=\"col-sm-3\"><input class=\"itmTable\" type=\"text\" placeholder=\"Weight\" size=\"4\"></div>"  
                     	+"</div>";  
		$('.itmContainer').append(row);        
		itmCount += 1;     				
	});

	// Adds spell element
	$('.splBtn').on('click', function(event) {
		var row =	"<div class=\"row\">"
				        +"<button type=\"button\" class=\"btn  btn-outline-dark splRemove \">X</button>"
                        +"<div class=\"col-sm-8\"><input class=\"splTable\" type=\"text\" placeholder=\"Name\" size=\"12\"></div>"
                        +"<div class=\"col-sm-4\"><input class=\"splTable\" type=\"text\" placeholder=\"Level\" size=\"4\"></div>"
                    	+"</div>";
		$('.splContainer').append(row);     
		splCount += 1;        				
	});

	// Removes added elements
	$('.atkContainer').on('click', '.atkRemove', function(event) {
		$(this).parent().remove();
		atkCount -= 1;  	
	});
	$('.itmContainer').on('click', '.itmRemove', function(event) {
		$(this).parent().remove();  
		itmCount -= 1;     
   			
	});
	$('.splContainer').on('click', '.splRemove', function(event) {
		$(this).parent().remove();  
		splCount -= 1;   			
	});


// Functions

// Converts a stat into the equivalent modifier
function getModifier(stat){

	if(stat > 30)
		stat = 30;
	if(stat < 0)
		stat = 0;

	var mod = Math.floor((stat-10)/2);

	return mod;
}

// Sets labels to the right modifier
function setModifier(){

	$('#strMod').html(getModifier($('#str').val()));

	$('#dexMod').html(getModifier($('#dex').val()));

	$('#conMod').html(getModifier($('#con').val()));

	$('#intMod').html(getModifier($('#int').val()));

	$('#wisMod').html(getModifier($('#wis').val()));

	$('#chaMod').html(getModifier($('#cha').val()));

}


// Sets character image to user uploaded image
function setImage() {

  var file    = document.querySelector('input[type=file]').files[0];
  var reader  = new FileReader();

  reader.onloadend = function () {
	$('#thumbnail').attr('src',reader.result);
	saved.setItem('image', reader.result);
  }

  if (file) {
	reader.readAsDataURL(file);
  } else {
    $('#preview').attr('src','...');
  }
}

// Changes to user selected tab
function changeTab(tabName) {

    var i;
    var x = $(".tab");
    for (i = 0; i < x.length; i++) {
       x[i].style.display = "none";  
    }
	$('#'+tabName).css({'display' : 'block'});  
	curTab = tabName;
}

// Addds modifier to saving throws
function toggleThrow(throwName) {

	var mod = parseInt($('#charProficiency').val());
	var stat = parseInt(saved.getItem(throwName));
	
	// If user has not entered a mod value
	if(isNaN(mod))
		mod = 0;

	// if user has not entered a stat value
	if(isNaN(stat))
		stat = 0;

	if($('.'+throwName).css('background-color')==='rgb(128, 128, 128)'){
		$('#'+throwName).val($('#'+throwName).val() - mod);
		
		$('.'+throwName).css('background-color', 'white');
			

		// Removes throw from list
		throwBonus.splice(throwBonus.indexOf(throwName), 1 );
	}
	else{
		$('#'+throwName).val(stat + mod);
		$('.'+throwName).css('background-color', 'grey');

		// Adds throw to list
		throwBonus.push(throwName);
	}
}

// Adds modifier to skill
function toggleSkill(skillName) {

	var mod = parseInt($('#charProficiency').val());
	var stat = parseInt(saved.getItem(skillName));
	
	// If user has not entered a mod value
	if(isNaN(mod))
		mod = 0;

	// if user has not entered a stat value
	if(isNaN(stat))
		stat = 0;

	if($('.'+skillName).css('background-color')==='rgb(128, 128, 128)'){
		$('#'+skillName).val($('#'+skillName).val() - mod);
		
		$('.'+skillName).css('background-color', 'white');
			

		// Removes skill from list
		skillBonus.splice(skillBonus.indexOf(skillName), 1 );
	}
	else{
		$('#'+skillName).val(stat + mod);
		$('.'+skillName).css('background-color', 'grey');
		// Adds skill to list
		skillBonus.push(skillName);
	}
}

// Updates saves
function checkSuccess(saveName){

	var id = $('#'+saveName).attr('id');

	if($('#'+saveName).css('background-color')==='rgb(128, 128, 128)'){
		$('#'+saveName).css('background-color', 'green');
		saves.push(id);
	}
	else{
		$('#'+saveName).css('background-color', 'rgb(128, 128, 128)');
		saves.splice(saves.indexOf(id), 1 );
	}
}

function checkFailure(saveName){

		var id = $('#'+saveName).attr('id');

		if($('#'+saveName).css('background-color')==='rgb(128, 128, 128)'){
			$('#'+saveName).css('background-color', 'red');
			saves.push(id);
		}
		else{
			$('#'+saveName).css('background-color', 'rgb(128, 128, 128)');
			saves.splice(saves.indexOf(id), 1 );
		}
}

// Update Skills when proficiency bonus is changed
function updateSkills(){
	var skillName;
	var mod = parseInt($('#charProficiency').val());
	var stat; 

	if(saved.getItem('skillBonus') != null)
		var skillName = saved.getItem('skillBonus').split(':');


	for(var i = 0;i < skillBonus.length;++i){
		stat = parseInt(saved.getItem(skillName[i]));

		// If user has not entered in a stat value
		if(isNaN(stat))
			stat = 0;

		$('#'+skillBonus[i]).val(stat + mod);
	}
}

// Update throwswhen proficiency bonus is changed
function updateThrows(){
	var throwName;
	var mod = parseInt($('#charProficiency').val());
	var stat; 

	if(saved.getItem('throwBonus') != null)
		var throwName = saved.getItem('throwBonus').split(':');

	if(saved.getItem('throwBonus') != null)
		var throwName = saved.getItem('throwBonus').split(':');


	for(var i = 0;i < throwBonus.length;++i){
		stat = parseInt(saved.getItem(throwName[i]));

		// If user has not entered in a stat value
		if(isNaN(stat))
			stat = 0;

		$('#'+throwBonus[i]).val(stat + mod);
	}

}

// populates attack list with stored data
function loadAttacks(size){

	if(saved.getItem('atkList'))
		var list = saved.getItem('atkList').split(':');
	else
		return;

	var j = 0;
	for(var i = 0;i < size;++i){
		
		var row = "<div class=\"row\">"
			+"<button type=\"button\" class=\"btn btn-outline-dark atkRemove\">X</button>"
			+"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Name\" size=\"8\" value=\""+list[j]+"\"></div>"
			+"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Bonus\" size=\"8\" value=\""+list[j+1]+"\"></div>"
			+"<div class=\"col-sm-4\"><input class=\"atkTable\" type=\"text\" placeholder=\"Damage\" size=\"8\" value=\""+list[j+2]+"\"></div>"
			+"</div>";
		$('.atkContainer').append(row); 
		j = j+3;
	}
}

// populates item list with stored data
function loadItems(size){

	if(saved.getItem('itmList'))
		var list = saved.getItem('itmList').split(':');
	else
		return;

	var j = 0;
	for(var i = 0; i < size;++i){
		var row =   "<div class=\"row\">"  
			+"<button type=\"button\" class=\"btn btn-outline-dark itmRemove \">X</button>"
			+"<div class=\"col-sm-6\"><div class=\"col-sm-2\">"
			+"</div><input class=\"itmTable\" type=\"text\" placeholder=\"Name\" size=\"8\" value=\""+list[j]+"\"></div>"
			+"<div class=\"col-sm-3\"><input class=\"itmTable\" type=\"text\" placeholder=\"#\" size=\"4\" value=\""+list[j+1]+"\"></div>"
			+"<div class=\"col-sm-3\"><input class=\"itmTable\" type=\"text\" placeholder=\"Weight\" size=\"4\" value=\""+list[j+2]+"\"></div>"  
		 	+"</div>";  
		$('.itmContainer').append(row);  
		j = j+3;
	}


}

// populates spell list with stored data
function loadSpells(size){

	if(saved.getItem('splList'))
		var list = saved.getItem('splList').split(':');
	else
		return;
	
	var j = 0;
	for(var i = 0;i<size;++i){
		var row =	"<div class=\"row\">"
				    +"<button type=\"button\" class=\"btn  btn-outline-dark splRemove \">X</button>"
                    +"<div class=\"col-sm-8\"><input class=\"splTable\" type=\"text\" placeholder=\"Name\" size=\"12\" value=\""+list[j]+"\"></div>"
                    +"<div class=\"col-sm-4\"><input class=\"splTable\" type=\"text\" placeholder=\"Level\" size=\"4\" value=\""+list[j+1]+"\"></div>"
                    +"</div>";
		$('.splContainer').append(row);  
		j = j+2;
	}
}

// populates all input fields with stored data
function loadCharacter(){

	// List sizes
	if(saved.getItem('atkSize'))
		atkCount = parseInt(saved.getItem('atkSize'));
	else
		atkCount = 0;
	
	if(saved.getItem('itmSize'))
		itmCount = parseInt(saved.getItem('itmSize'));
	else
		itmCount = 0;	

	if(saved.getItem('splSize'))
		splCount = parseInt(saved.getItem('splSize'));
	else
		splCount = 0;

	// Character information
	$('#charName').val(saved.getItem('charName'));
	$('#charRace').val(saved.getItem('charRace'));
	$('#charLevel').val(saved.getItem('charLevel'));
	$('#charBackground').val(saved.getItem('charBackground'));
	$('#charAlignment').val(saved.getItem('charAlignment'));
	$('#charExp').val(saved.getItem('charExp'));
	$('#charProficiency').val(saved.getItem('charProficiency'));
	$('#charInit').val(saved.getItem('charInit'));
	$('#charSpeed').val(saved.getItem('charSpeed'));
	$('#charAC').val(saved.getItem('charAC'));
	$('#charHealth').val(saved.getItem('charHealth'));

	// Character Stats
	$('#str').val(saved.getItem('str'));
	$('#dex').val(saved.getItem('dex'));
	$('#con').val(saved.getItem('con'));
	$('#int').val(saved.getItem('int'));
	$('#wis').val(saved.getItem('wis'));
	$('#cha').val(saved.getItem('cha'));
	setModifier();

	// Currency 
	$('#gold').val(saved.getItem('gold'));
	$('#silver').val(saved.getItem('silver'));
	$('#copper').val(saved.getItem('copper'));

	// Lists
	loadAttacks(atkCount);
	loadItems(itmCount);
	loadSpells(splCount);

	// Skills
	$('#Acrobatics').val(saved.getItem('Acrobatics'));
	$('#AnimalHandling').val(saved.getItem('AnimalHandling'));
	$('#Arcana').val(saved.getItem('Arcana'));
	$('#Athletics').val(saved.getItem('Athletics'));
	$('#Deception').val(saved.getItem('Deception'));
	$('#History').val(saved.getItem('History'));
	$('#Insight').val(saved.getItem('Insight'));
	$('#Intimidation').val(saved.getItem('Intimidation'));
	$('#Investigation').val(saved.getItem('Investigation'));
	$('#Medicine').val(saved.getItem('Medicine'));
	$('#Nature').val(saved.getItem('Nature'));
	$('#Perception').val(saved.getItem('Perception'));
	$('#Religion').val(saved.getItem('Religion'));
	$('#SleightofHand').val(saved.getItem('SleightofHand'));
	$('#Stealth').val(saved.getItem('Stealth'));
	$('#Survival').val(saved.getItem('Survival'));

	// Spell Slots
	for(var i = 1;i<10;++i){
		$('#'+i+'Cur').val(saved.getItem(i+'Cur'));
		$('#'+i+'Max').val(saved.getItem(i+'Max'));
	}

	// Throws
	$('#strThrow').val(saved.getItem('strThrow'));
	$('#dexThrow').val(saved.getItem('dexThrow'));
	$('#conThrow').val(saved.getItem('conThrow'));
	$('#wisThrow').val(saved.getItem('wisThrow'));
	$('#intThrow').val(saved.getItem('intThrow'));
	$('#chaThrow').val(saved.getItem('chaThrow'));

	//Info
	$('#profText').val(saved.getItem('profText'));
	$('#featText').val(saved.getItem('featText'));
	
	// Skill Bonus
	if(saved.getItem('skillBonus') != null){
		var temp = saved.getItem('skillBonus').split(':');
		for(var i = 0;i < temp.length - 1;++i){
			toggleSkill(temp[i]);
		}
	}

	// Throw Bonus
	if(saved.getItem('throwBonus') != null){
		var temp = saved.getItem('throwBonus').split(':');
		for(var i = 0;i < temp.length - 1;++i){
			toggleThrow(temp[i]);
		}
	}

	// saves
	if(saved.getItem('saves') != null){
		var temp = saved.getItem('saves').split(':');
		for(var i = 0;i < temp.length - 1;++i){
			if(temp[i][4] < 4)
				checkSuccess(temp[i]);
			else
				checkFailure(temp[i]);
		}
	}


	// If the user has uploaded an image, change to that image
	if(saved.getItem('image'))
		$('#thumbnail').attr('src',saved.getItem('image'));

	
	// Last tab selected
	changeTab(saved.getItem('tab'));

}

// saves all input fields to local storage
function saveCharacter(){
	var temp;

	// Character information
	saved.setItem('charName', $('#charName').val());
	saved.setItem('charRace', $('#charRace').val());
	saved.setItem('charLevel', $('#charLevel').val());
	saved.setItem('charBackground', $('#charBackground').val());
	saved.setItem('charAlignment', $('#charAlignment').val());
	saved.setItem('charExp', $('#charExp').val());
	saved.setItem('charProficiency', $('#charProficiency').val());
	saved.setItem('charInit', $('#charInit').val());
	saved.setItem('charSpeed', $('#charSpeed').val());
	saved.setItem('charAC', $('#charAC').val());
	saved.setItem('charHealth', $('#charHealth').val());

	// Character Stats
	saved.setItem('str', $('#str').val());
	saved.setItem('dex', $('#dex').val());
	saved.setItem('con', $('#con').val());
	saved.setItem('int', $('#int').val());
	saved.setItem('wis', $('#wis').val());
	saved.setItem('cha', $('#cha').val());

	// Currency
	saved.setItem('gold', $('#gold').val());
	saved.setItem('silver', $('#silver').val());
	saved.setItem('copper', $('#copper').val());

	// List sizes
	saved.setItem('atkSize', atkCount);
	saved.setItem('itmSize', itmCount);
	saved.setItem('splSize', splCount);

	// Tab
	saved.setItem('tab', curTab);

	// List contents
	$('.atkTable').each(function(){
		atkList += $(this).val()+':';
	})
	$('.itmTable').each(function(){
		itmList += $(this).val()+':';
	})
	$('.splTable').each(function(){
		splList += $(this).val()+':';
	})

	saved.setItem('atkList', atkList);
	saved.setItem('itmList', itmList);
	saved.setItem('splList', splList);

	// Info
	saved.setItem('profText', $('#profText').val());
	saved.setItem('featText', $('#featText').val());

	// Spell Slots
	for(var i = 1;i<10;++i){
		saved.setItem(i+'Cur', $('#'+i+'Cur').val());
		saved.setItem(i+'Max', $('#'+i+'Max').val());
	}

	// Saves
	temp = '';
	for(var i = 0;i < saves.length;++i){
		temp += saves[i] + ':';
	}
	saved.setItem('saves', temp);

	// SkillBonus
	temp = '';
	for(var i = 0;i < skillBonus.length;++i){
		temp += skillBonus[i] + ':';
	}
	saved.setItem('skillBonus', temp);

	// ThrowBonus
	temp = '';
	for(var i = 0;i < throwBonus.length;++i){
		temp += throwBonus[i] + ':';
	}
	saved.setItem('throwBonus', temp);

}