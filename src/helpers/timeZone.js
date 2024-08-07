const timeZone = [
    { id: 1, name:'Africa/Abidjan'},
    { id: 1, name:'Africa/Accra'},
    { id: 1, name:'Africa/Addis_Ababa'},
    { id: 1, name:'Africa/Algiers'},
    { id: 1, name:'Africa/Asmara'},
    { id: 1, name:'Africa/Asmera'},
    { id: 1, name:'Africa/Bamako'},
    { id: 1, name:'Africa/Bangui'},
    { id: 1, name:'Africa/Banjul'},
    { id: 1, name:'Africa/Bissau'},
    { id: 1, name:'Africa/Blantyre'},
    { id: 1, name:'Africa/Brazzaville'},
    { id: 1, name:'Africa/Bujumbura'},
    { id: 1, name:'Africa/Cairo'},
    { id: 1, name:'Africa/Casablanca'},
    { id: 1, name:'Africa/Ceuta'},
    { id: 1, name:'Africa/Conakry'},
    { id: 1, name:'Africa/Dakar'},
    { id: 1, name:'Africa/Dar_es_Salaam'},
    { id: 1, name:'Africa/Djibouti'},
    { id: 1, name:'Africa/Douala'},
    { id: 1, name:'Africa/El_Aaiun'},
    { id: 1, name:'Africa/Freetown'},
    { id: 1, name:'Africa/Gaborone'},
    { id: 1, name:'Africa/Harare'},
    { id: 1, name:'Africa/Johannesburg'},
    { id: 1, name:'Africa/Juba'},
    { id: 1, name:'Africa/Kampala'},
    { id: 1, name:'Africa/Khartoum'},
    { id: 1, name:'Africa/Kigali'},
    { id: 1, name:'Africa/Kinshasa'},
    { id: 1, name:'Africa/Lagos'},
    { id: 1, name:'Africa/Libreville'},
    { id: 1, name:'Africa/Lome'},
    { id: 1, name:'Africa/Luanda'},
    { id: 1, name:'Africa/Lubumbashi'},
    { id: 1, name:'Africa/Lusaka'},
    { id: 1, name:'Africa/Malabo'},
    { id: 1, name:'Africa/Maputo'},
    { id: 1, name:'Africa/Maseru'},
    { id: 1, name:'Africa/Mbabane'},
    { id: 1, name:'Africa/Mogadishu'},
    { id: 1, name:'Africa/Monrovia'},
    { id: 1, name:'Africa/Nairobi'},
    { id: 1, name:'Africa/Ndjamena'},
    { id: 1, name:'Africa/Niamey'},
    { id: 1, name:'Africa/Nouakchott'},
    { id: 1, name:'Africa/Ouagadougou'},
    { id: 1, name:'Africa/Porto-Novo'},
    { id: 1, name:'Africa/Sao_Tome'},
    { id: 1, name:'Africa/Timbuktu'},
    { id: 1, name:'Africa/Tripoli'},
    { id: 1, name:'Africa/Tunis'},
    { id: 1, name:'Africa/Windhoek'},
    { id: 1, name:'America/Adak'},
    { id: 1, name:'America/Anchorage'},
    { id: 1, name:'America/Anguilla'},
    { id: 1, name:'America/Antigua'},
    { id: 1, name:'America/Araguaina'},
    { id: 1, name:'America/Argentina/Buenos_Aires'},
    { id: 1, name:'America/Argentina/Catamarca'},
    { id: 1, name:'America/Argentina/ComodRivadavia'},
    { id: 1, name:'America/Argentina/Cordoba'},
    { id: 1, name:'America/Argentina/Jujuy'},
    { id: 1, name:'America/Argentina/La_Rioja'},
    { id: 1, name:'America/Argentina/Mendoza'},
    { id: 1, name:'America/Argentina/Rio_Gallegos'},
    { id: 1, name:'America/Argentina/Salta'},
    { id: 1, name:'America/Argentina/San_Juan'},
    { id: 1, name:'America/Argentina/San_Luis'},
    { id: 1, name:'America/Argentina/Tucuman'},
    { id: 1, name:'America/Argentina/Ushuaia'},
    { id: 1, name:'America/Aruba'},
    { id: 1, name:'America/Asuncion'},
    { id: 1, name:'America/Atikokan'},
    { id: 1, name:'America/Atka'},
    { id: 1, name:'America/Bahia'},
    { id: 1, name:'America/Bahia_Banderas'},
    { id: 1, name:'America/Barbados'},
    { id: 1, name:'America/Belem'},
    { id: 1, name:'America/Belize'},
    { id: 1, name:'America/Blanc-Sablon'},
    { id: 1, name:'America/Boa_Vista'},
    { id: 1, name:'America/Bogota'},
    { id: 1, name:'America/Boise'},
    { id: 1, name:'America/Buenos_Aires'},
    { id: 1, name:'America/Cambridge_Bay'},
    { id: 1, name:'America/Campo_Grande'},
    { id: 1, name:'America/Cancun'},
    { id: 1, name:'America/Caracas'},
    { id: 1, name:'America/Catamarca'},
    { id: 1, name:'America/Cayenne'},
    { id: 1, name:'America/Cayman'},
    { id: 1, name:'America/Chicago'},
    { id: 1, name:'America/Chihuahua'},
    { id: 1, name:'America/Coral_Harbour'},
    { id: 1, name:'America/Cordoba'},
    { id: 1, name:'America/Costa_Rica'},
    { id: 1, name:'America/Creston'},
    { id: 1, name:'America/Cuiaba'},
    { id: 1, name:'America/Curacao'},
    { id: 1, name:'America/Danmarkshavn'},
    { id: 1, name:'America/Dawson'},
    { id: 1, name:'America/Dawson_Creek'},
    { id: 1, name:'America/Denver'},
    { id: 1, name:'America/Detroit'},
    { id: 1, name:'America/Dominica'},
    { id: 1, name:'America/Edmonton'},
    { id: 1, name:'America/Eirunepe'},
    { id: 1, name:'America/El_Salvador'},
    { id: 1, name:'America/Ensenada'},
    { id: 1, name:'America/Fort_Nelson'},
    { id: 1, name:'America/Fort_Wayne'},
    { id: 1, name:'America/Fortaleza'},
    { id: 1, name:'America/Glace_Bay'},
    { id: 1, name:'America/Godthab'},
    { id: 1, name:'America/Goose_Bay'},
    { id: 1, name:'America/Grand_Turk'},
    { id: 1, name:'America/Grenada'},
    { id: 1, name:'America/Guadeloupe'},
    { id: 1, name:'America/Guatemala'},
    { id: 1, name:'America/Guayaquil'},
    { id: 1, name:'America/Guyana'},
    { id: 1, name:'America/Halifax'},
    { id: 1, name:'America/Havana'},
    { id: 1, name:'America/Hermosillo'},
    { id: 1, name:'America/Indiana/Indianapolis'},
    { id: 1, name:'America/Indiana/Knox'},
    { id: 1, name:'America/Indiana/Marengo'},
    { id: 1, name:'America/Indiana/Petersburg'},
    { id: 1, name:'America/Indiana/Tell_City'},
    { id: 1, name:'America/Indiana/Vevay'},
    { id: 1, name:'America/Indiana/Vincennes'},
    { id: 1, name:'America/Indiana/Winamac'},
    { id: 1, name:'America/Indianapolis'},
    { id: 1, name:'America/Inuvik'},
    { id: 1, name:'America/Iqaluit'},
    { id: 1, name:'America/Jamaica'},
    { id: 1, name:'America/Jujuy'},
    { id: 1, name:'America/Juneau'},
    { id: 1, name:'America/Kentucky/Louisville'},
    { id: 1, name:'America/Kentucky/Monticello'},
    { id: 1, name:'America/Knox_IN'},
    { id: 1, name:'America/Kralendijk'},
    { id: 1, name:'America/La_Paz'},
    { id: 1, name:'America/Lima'},
    { id: 1, name:'America/Los_Angeles'},
    { id: 1, name:'America/Louisville'},
    { id: 1, name:'America/Lower_Princes'},
    { id: 1, name:'America/Maceio'},
    { id: 1, name:'America/Managua'},
    { id: 1, name:'America/Manaus'},
    { id: 1, name:'America/Marigot'},
    { id: 1, name:'America/Martinique'},
    { id: 1, name:'America/Matamoros'},
    { id: 1, name:'America/Mazatlan'},
    { id: 1, name:'America/Mendoza'},
    { id: 1, name:'America/Menominee'},
    { id: 1, name:'America/Merida'},
    { id: 1, name:'America/Metlakatla'},
    { id: 1, name:'America/Mexico_City'},
    { id: 1, name:'America/Miquelon'},
    { id: 1, name:'America/Moncton'},
    { id: 1, name:'America/Monterrey'},
    { id: 1, name:'America/Montevideo'},
    { id: 1, name:'America/Montreal'},
    { id: 1, name:'America/Montserrat'},
    { id: 1, name:'America/Nassau'},
    { id: 1, name:'America/New_York'},
    { id: 1, name:'America/Nipigon'},
    { id: 1, name:'America/Nome'},
    { id: 1, name:'America/Noronha'},
    { id: 1, name:'America/North_Dakota/Beulah'},
    { id: 1, name:'America/North_Dakota/Center'},
    { id: 1, name:'America/North_Dakota/New_Salem'},
    { id: 1, name:'America/Ojinaga'},
    { id: 1, name:'America/Panama'},
    { id: 1, name:'America/Pangnirtung'},
    { id: 1, name:'America/Paramaribo'},
    { id: 1, name:'America/Phoenix'},
    { id: 1, name:'America/Port-au-Prince'},
    { id: 1, name:'America/Port_of_Spain'},
    { id: 1, name:'America/Porto_Acre'},
    { id: 1, name:'America/Porto_Velho'},
    { id: 1, name:'America/Puerto_Rico'},
    { id: 1, name:'America/Punta_Arenas'},
    { id: 1, name:'America/Rainy_River'},
    { id: 1, name:'America/Rankin_Inlet'},
    { id: 1, name:'America/Recife'},
    { id: 1, name:'America/Regina'},
    { id: 1, name:'America/Resolute'},
    { id: 1, name:'America/Rio_Branco'},
    { id: 1, name:'America/Rosario'},
    { id: 1, name:'America/Santa_Isabel'},
    { id: 1, name:'America/Santarem'},
    { id: 1, name:'America/Santiago'},
    { id: 1, name:'America/Santo_Domingo'},
    { id: 1, name:'America/Sao_Paulo'},
    { id: 1, name:'America/Scoresbysund'},
    { id: 1, name:'America/Shiprock'},
    { id: 1, name:'America/Sitka'},
    { id: 1, name:'America/St_Barthelemy'},
    { id: 1, name:'America/St_Johns'},
    { id: 1, name:'America/St_Kitts'},
    { id: 1, name:'America/St_Lucia'},
    { id: 1, name:'America/St_Thomas'},
    { id: 1, name:'America/St_Vincent'},
    { id: 1, name:'America/Swift_Current'},
    { id: 1, name:'America/Tegucigalpa'},
    { id: 1, name:'America/Thule'},
    { id: 1, name:'America/Thunder_Bay'},
    { id: 1, name:'America/Tijuana'},
    { id: 1, name:'America/Toronto'},
    { id: 1, name:'America/Tortola'},
    { id: 1, name:'America/Vancouver'},
    { id: 1, name:'America/Virgin'},
    { id: 1, name:'America/Whitehorse'},
    { id: 1, name:'America/Winnipeg'},
    { id: 1, name:'America/Yakutat'},
    { id: 1, name:'America/Yellowknife'},
    { id: 1, name:'Antarctica/Casey'},
    { id: 1, name:'Antarctica/Davis'},
    { id: 1, name:'Antarctica/DumontDUrville'},
    { id: 1, name:'Antarctica/Macquarie'},
    { id: 1, name:'Antarctica/Mawson'},
    { id: 1, name:'Antarctica/McMurdo'},
    { id: 1, name:'Antarctica/Palmer'},
    { id: 1, name:'Antarctica/Rothera'},
    { id: 1, name:'Antarctica/South_Pole'},
    { id: 1, name:'Antarctica/Syowa'},
    { id: 1, name:'Antarctica/Troll'},
    { id: 1, name:'Antarctica/Vostok'},
    { id: 1, name:'Arctic/Longyearbyen'},
    { id: 1, name:'Asia/Aden'},
    { id: 1, name:'Asia/Almaty'},
    { id: 1, name:'Asia/Amman'},
    { id: 1, name:'Asia/Anadyr'},
    { id: 1, name:'Asia/Aqtau'},
    { id: 1, name:'Asia/Aqtobe'},
    { id: 1, name:'Asia/Ashgabat'},
    { id: 1, name:'Asia/Ashkhabad'},
    { id: 1, name:'Asia/Atyrau'},
    { id: 1, name:'Asia/Baghdad'},
    { id: 1, name:'Asia/Bahrain'},
    { id: 1, name:'Asia/Baku'},
    { id: 1, name:'Asia/Bangkok'},
    { id: 1, name:'Asia/Barnaul'},
    { id: 1, name:'Asia/Beirut'},
    { id: 1, name:'Asia/Bishkek'},
    { id: 1, name:'Asia/Brunei'},
    { id: 1, name:'Asia/Calcutta'},
    { id: 1, name:'Asia/Chita'},
    { id: 1, name:'Asia/Choibalsan'},
    { id: 1, name:'Asia/Chongqing'},
    { id: 1, name:'Asia/Chungking'},
    { id: 1, name:'Asia/Colombo'},
    { id: 1, name:'Asia/Dacca'},
    { id: 1, name:'Asia/Damascus'},
    { id: 1, name:'Asia/Dhaka'},
    { id: 1, name:'Asia/Dili'},
    { id: 1, name:'Asia/Dubai'},
    { id: 1, name:'Asia/Dushanbe'},
    { id: 1, name:'Asia/Famagusta'},
    { id: 1, name:'Asia/Gaza'},
    { id: 1, name:'Asia/Harbin'},
    { id: 1, name:'Asia/Hebron'},
    { id: 1, name:'Asia/Ho_Chi_Minh'},
    { id: 1, name:'Asia/Hong_Kong'},
    { id: 1, name:'Asia/Hovd'},
    { id: 1, name:'Asia/Irkutsk'},
    { id: 1, name:'Asia/Istanbul'},
    { id: 1, name:'Asia/Jakarta'},
    { id: 1, name:'Asia/Jayapura'},
    { id: 1, name:'Asia/Jerusalem'},
    { id: 1, name:'Asia/Kabul'},
    { id: 1, name:'Asia/Kamchatka'},
    { id: 1, name:'Asia/Karachi'},
    { id: 1, name:'Asia/Kashgar'},
    { id: 1, name:'Asia/Kathmandu'},
    { id: 1, name:'Asia/Katmandu'},
    { id: 1, name:'Asia/Khandyga'},
    { id: 1, name:'Asia/Kolkata'},
    { id: 1, name:'Asia/Krasnoyarsk'},
    { id: 1, name:'Asia/Kuala_Lumpur'},
    { id: 1, name:'Asia/Kuching'},
    { id: 1, name:'Asia/Kuwait'},
    { id: 1, name:'Asia/Macao'},
    { id: 1, name:'Asia/Macau'},
    { id: 1, name:'Asia/Magadan'},
    { id: 1, name:'Asia/Makassar'},
    { id: 1, name:'Asia/Manila'},
    { id: 1, name:'Asia/Muscat'},
    { id: 1, name:'Asia/Nicosia'},
    { id: 1, name:'Asia/Novokuznetsk'},
    { id: 1, name:'Asia/Novosibirsk'},
    { id: 1, name:'Asia/Omsk'},
    { id: 1, name:'Asia/Oral'},
    { id: 1, name:'Asia/Phnom_Penh'},
    { id: 1, name:'Asia/Pontianak'},
    { id: 1, name:'Asia/Pyongyang'},
    { id: 1, name:'Asia/Qatar'},
    { id: 1, name:'Asia/Qyzylorda'},
    { id: 1, name:'Asia/Rangoon'},
    { id: 1, name:'Asia/Riyadh'},
    { id: 1, name:'Asia/Saigon'},
    { id: 1, name:'Asia/Sakhalin'},
    { id: 1, name:'Asia/Samarkand'},
    { id: 1, name:'Asia/Seoul'},
    { id: 1, name:'Asia/Shanghai'},
    { id: 1, name:'Asia/Singapore'},
    { id: 1, name:'Asia/Srednekolymsk'},
    { id: 1, name:'Asia/Taipei'},
    { id: 1, name:'Asia/Tashkent'},
    { id: 1, name:'Asia/Tbilisi'},
    { id: 1, name:'Asia/Tehran'},
    { id: 1, name:'Asia/Tel_Aviv'},
    { id: 1, name:'Asia/Thimbu'},
    { id: 1, name:'Asia/Thimphu'},
    { id: 1, name:'Asia/Tokyo'},
    { id: 1, name:'Asia/Tomsk'},
    { id: 1, name:'Asia/Ujung_Pandang'},
    { id: 1, name:'Asia/Ulaanbaatar'},
    { id: 1, name:'Asia/Ulan_Bator'},
    { id: 1, name:'Asia/Urumqi'},
    { id: 1, name:'Asia/Ust-Nera'},
    { id: 1, name:'Asia/Vientiane'},
    { id: 1, name:'Asia/Vladivostok'},
    { id: 1, name:'Asia/Yakutsk'},
    { id: 1, name:'Asia/Yangon'},
    { id: 1, name:'Asia/Yekaterinburg'},
    { id: 1, name:'Asia/Yerevan'},
    { id: 1, name:'Atlantic/Azores'},
    { id: 1, name:'Atlantic/Bermuda'},
    { id: 1, name:'Atlantic/Canary'},
    { id: 1, name:'Atlantic/Cape_Verde'},
    { id: 1, name:'Atlantic/Faeroe'},
    { id: 1, name:'Atlantic/Faroe'},
    { id: 1, name:'Atlantic/Jan_Mayen'},
    { id: 1, name:'Atlantic/Madeira'},
    { id: 1, name:'Atlantic/Reykjavik'},
    { id: 1, name:'Atlantic/South_Georgia'},
    { id: 1, name:'Atlantic/St_Helena'},
    { id: 1, name:'Atlantic/Stanley'},
    { id: 1, name:'Australia/ACT'},
    { id: 1, name:'Australia/Adelaide'},
    { id: 1, name:'Australia/Brisbane'},
    { id: 1, name:'Australia/Broken_Hill'},
    { id: 1, name:'Australia/Canberra'},
    { id: 1, name:'Australia/Currie'},
    { id: 1, name:'Australia/Darwin'},
    { id: 1, name:'Australia/Eucla'},
    { id: 1, name:'Australia/Hobart'},
    { id: 1, name:'Australia/LHI'},
    { id: 1, name:'Australia/Lindeman'},
    { id: 1, name:'Australia/Lord_Howe'},
    { id: 1, name:'Australia/Melbourne'},
    { id: 1, name:'Australia/NSW'},
    { id: 1, name:'Australia/North'},
    { id: 1, name:'Australia/Perth'},
    { id: 1, name:'Australia/Queensland'},
    { id: 1, name:'Australia/South'},
    { id: 1, name:'Australia/Sydney'},
    { id: 1, name:'Australia/Tasmania'},
    { id: 1, name:'Australia/Victoria'},
    { id: 1, name:'Australia/West'},
    { id: 1, name:'Australia/Yancowinna'},
    { id: 1, name:'Brazil/Acre'},
    { id: 1, name:'Brazil/DeNoronha'},
    { id: 1, name:'Brazil/East'},
    { id: 1, name:'Brazil/West'},
    { id: 1, name:'CET'},
    { id: 1, name:'CST6CDT'},
    { id: 1, name:'Canada/Atlantic'},
    { id: 1, name:'Canada/Central'},
    { id: 1, name:'Canada/Eastern'},
    { id: 1, name:'Canada/Mountain'},
    { id: 1, name:'Canada/Newfoundland'},
    { id: 1, name:'Canada/Pacific'},
    { id: 1, name:'Canada/Saskatchewan'},
    { id: 1, name:'Canada/Yukon'},
    { id: 1, name:'Chile/Continental'},
    { id: 1, name:'Chile/EasterIsland'},
    { id: 1, name:'Cuba'},
    { id: 1, name:'EET'},
    { id: 1, name:'EST'},
    { id: 1, name:'EST5EDT'},
    { id: 1, name:'Egypt'},
    { id: 1, name:'Eire'},
    { id: 1, name:'Etc/GMT'},
    { id: 1, name:'Etc/GMT+0'},
    { id: 1, name:'Etc/GMT+1'},
    { id: 1, name:'Etc/GMT+10'},
    { id: 1, name:'Etc/GMT+11'},
    { id: 1, name:'Etc/GMT+12'},
    { id: 1, name:'Etc/GMT+2'},
    { id: 1, name:'Etc/GMT+3'},
    { id: 1, name:'Etc/GMT+4'},
    { id: 1, name:'Etc/GMT+5'},
    { id: 1, name:'Etc/GMT+6'},
    { id: 1, name:'Etc/GMT+7'},
    { id: 1, name:'Etc/GMT+8'},
    { id: 1, name:'Etc/GMT+9'},
    { id: 1, name:'Etc/GMT-0'},
    { id: 1, name:'Etc/GMT-1'},
    { id: 1, name:'Etc/GMT-10'},
    { id: 1, name:'Etc/GMT-11'},
    { id: 1, name:'Etc/GMT-12'},
    { id: 1, name:'Etc/GMT-13'},
    { id: 1, name:'Etc/GMT-14'},
    { id: 1, name:'Etc/GMT-2'},
    { id: 1, name:'Etc/GMT-3'},
    { id: 1, name:'Etc/GMT-4'},
    { id: 1, name:'Etc/GMT-5'},
    { id: 1, name:'Etc/GMT-6'},
    { id: 1, name:'Etc/GMT-7'},
    { id: 1, name:'Etc/GMT-8'},
    { id: 1, name:'Etc/GMT-9'},
    { id: 1, name:'Etc/GMT0'},
    { id: 1, name:'Etc/Greenwich'},
    { id: 1, name:'Etc/UCT'},
    { id: 1, name:'Etc/UTC'},
    { id: 1, name:'Etc/Universal'},
    { id: 1, name:'Etc/Zulu'},
    { id: 1, name:'Europe/Amsterdam'},
    { id: 1, name:'Europe/Andorra'},
    { id: 1, name:'Europe/Astrakhan'},
    { id: 1, name:'Europe/Athens'},
    { id: 1, name:'Europe/Belfast'},
    { id: 1, name:'Europe/Belgrade'},
    { id: 1, name:'Europe/Berlin'},
    { id: 1, name:'Europe/Bratislava'},
    { id: 1, name:'Europe/Brussels'},
    { id: 1, name:'Europe/Bucharest'},
    { id: 1, name:'Europe/Budapest'},
    { id: 1, name:'Europe/Busingen'},
    { id: 1, name:'Europe/Chisinau'},
    { id: 1, name:'Europe/Copenhagen'},
    { id: 1, name:'Europe/Dublin'},
    { id: 1, name:'Europe/Gibraltar'},
    { id: 1, name:'Europe/Guernsey'},
    { id: 1, name:'Europe/Helsinki'},
    { id: 1, name:'Europe/Isle_of_Man'},
    { id: 1, name:'Europe/Istanbul'},
    { id: 1, name:'Europe/Jersey'},
    { id: 1, name:'Europe/Kaliningrad'},
    { id: 1, name:'Europe/Kiev'},
    { id: 1, name:'Europe/Kirov'},
    { id: 1, name:'Europe/Lisbon'},
    { id: 1, name:'Europe/Ljubljana'},
    { id: 1, name:'Europe/London'},
    { id: 1, name:'Europe/Luxembourg'},
    { id: 1, name:'Europe/Madrid'},
    { id: 1, name:'Europe/Malta'},
    { id: 1, name:'Europe/Mariehamn'},
    { id: 1, name:'Europe/Minsk'},
    { id: 1, name:'Europe/Monaco'},
    { id: 1, name:'Europe/Moscow'},
    { id: 1, name:'Europe/Nicosia'},
    { id: 1, name:'Europe/Oslo'},
    { id: 1, name:'Europe/Paris'},
    { id: 1, name:'Europe/Podgorica'},
    { id: 1, name:'Europe/Prague'},
    { id: 1, name:'Europe/Riga'},
    { id: 1, name:'Europe/Rome'},
    { id: 1, name:'Europe/Samara'},
    { id: 1, name:'Europe/San_Marino'},
    { id: 1, name:'Europe/Sarajevo'},
    { id: 1, name:'Europe/Saratov'},
    { id: 1, name:'Europe/Simferopol'},
    { id: 1, name:'Europe/Skopje'},
    { id: 1, name:'Europe/Sofia'},
    { id: 1, name:'Europe/Stockholm'},
    { id: 1, name:'Europe/Tallinn'},
    { id: 1, name:'Europe/Tirane'},
    { id: 1, name:'Europe/Tiraspol'},
    { id: 1, name:'Europe/Ulyanovsk'},
    { id: 1, name:'Europe/Uzhgorod'},
    { id: 1, name:'Europe/Vaduz'},
    { id: 1, name:'Europe/Vatican'},
    { id: 1, name:'Europe/Vienna'},
    { id: 1, name:'Europe/Vilnius'},
    { id: 1, name:'Europe/Volgograd'},
    { id: 1, name:'Europe/Warsaw'},
    { id: 1, name:'Europe/Zagreb'},
    { id: 1, name:'Europe/Zaporozhye'},
    { id: 1, name:'Europe/Zurich'},
    { id: 1, name:'GB'},
    { id: 1, name:'GB-Eire'},
    { id: 1, name:'GMT'},
    { id: 1, name:'GMT+0'},
    { id: 1, name:'GMT-0'},
    { id: 1, name:'GMT0'},
    { id: 1, name:'Greenwich'},
    { id: 1, name:'HST'},
    { id: 1, name:'Hongkong'},
    { id: 1, name:'Iceland'},
    { id: 1, name:'Indian/Antananarivo'},
    { id: 1, name:'Indian/Chagos'},
    { id: 1, name:'Indian/Christmas'},
    { id: 1, name:'Indian/Cocos'},
    { id: 1, name:'Indian/Comoro'},
    { id: 1, name:'Indian/Kerguelen'},
    { id: 1, name:'Indian/Mahe'},
    { id: 1, name:'Indian/Maldives'},
    { id: 1, name:'Indian/Mauritius'},
    { id: 1, name:'Indian/Mayotte'},
    { id: 1, name:'Indian/Reunion'},
    { id: 1, name:'Iran'},
    { id: 1, name:'Israel'},
    { id: 1, name:'Jamaica'},
    { id: 1, name:'Japan'},
    { id: 1, name:'Kwajalein'},
    { id: 1, name:'Libya'},
    { id: 1, name:'MET'},
    { id: 1, name:'MST'},
    { id: 1, name:'MST7MDT'},
    { id: 1, name:'Mexico/BajaNorte'},
    { id: 1, name:'Mexico/BajaSur'},
    { id: 1, name:'Mexico/General'},
    { id: 1, name:'NZ'},
    { id: 1, name:'NZ-CHAT'},
    { id: 1, name:'Navajo'},
    { id: 1, name:'PRC'},
    { id: 1, name:'PST8PDT'},
    { id: 1, name:'Pacific/Apia'},
    { id: 1, name:'Pacific/Auckland'},
    { id: 1, name:'Pacific/Bougainville'},
    { id: 1, name:'Pacific/Chatham'},
    { id: 1, name:'Pacific/Chuuk'},
    { id: 1, name:'Pacific/Easter'},
    { id: 1, name:'Pacific/Efate'},
    { id: 1, name:'Pacific/Enderbury'},
    { id: 1, name:'Pacific/Fakaofo'},
    { id: 1, name:'Pacific/Fiji'},
    { id: 1, name:'Pacific/Funafuti'},
    { id: 1, name:'Pacific/Galapagos'},
    { id: 1, name:'Pacific/Gambier'},
    { id: 1, name:'Pacific/Guadalcanal'},
    { id: 1, name:'Pacific/Guam'},
    { id: 1, name:'Pacific/Honolulu'},
    { id: 1, name:'Pacific/Johnston'},
    { id: 1, name:'Pacific/Kiritimati'},
    { id: 1, name:'Pacific/Kosrae'},
    { id: 1, name:'Pacific/Kwajalein'},
    { id: 1, name:'Pacific/Majuro'},
    { id: 1, name:'Pacific/Marquesas'},
    { id: 1, name:'Pacific/Midway'},
    { id: 1, name:'Pacific/Nauru'},
    { id: 1, name:'Pacific/Niue'},
    { id: 1, name:'Pacific/Norfolk'},
    { id: 1, name:'Pacific/Noumea'},
    { id: 1, name:'Pacific/Pago_Pago'},
    { id: 1, name:'Pacific/Palau'},
    { id: 1, name:'Pacific/Pitcairn'},
    { id: 1, name:'Pacific/Pohnpei'},
    { id: 1, name:'Pacific/Ponape'},
    { id: 1, name:'Pacific/Port_Moresby'},
    { id: 1, name:'Pacific/Rarotonga'},
    { id: 1, name:'Pacific/Saipan'},
    { id: 1, name:'Pacific/Samoa'},
    { id: 1, name:'Pacific/Tahiti'},
    { id: 1, name:'Pacific/Tarawa'},
    { id: 1, name:'Pacific/Tongatapu'},
    { id: 1, name:'Pacific/Truk'},
    { id: 1, name:'Pacific/Wake'},
    { id: 1, name:'Pacific/Wallis'},
    { id: 1, name:'Pacific/Yap'},
    { id: 1, name:'Poland'},
    { id: 1, name:'Portugal'},
    { id: 1, name:'ROC'},
    { id: 1, name:'ROK'},
    { id: 1, name:'Singapore'},
    { id: 1, name:'Turkey'},
    { id: 1, name:'UCT'},
    { id: 1, name:'US/Alaska'},
    { id: 1, name:'US/Aleutian'},
    { id: 1, name:'US/Arizona'},
    { id: 1, name:'US/Central'},
    { id: 1, name:'US/East-Indiana'},
    { id: 1, name:'US/Eastern'},
    { id: 1, name:'US/Hawaii'},
    { id: 1, name:'US/Indiana-Starke'},
    { id: 1, name:'US/Michigan'},
    { id: 1, name:'US/Mountain'},
    { id: 1, name:'US/Pacific'},
    { id: 1, name:'US/Pacific-New'},
    { id: 1, name:'US/Samoa'},
    { id: 1, name:'UTC'},
    { id: 1, name:'Universal'},
    { id: 1, name:'W-SU'},
    { id: 1, name:'WET'},
    { id: 1, name:'Zulu'},
];

export default timeZone