exports.HELLO = '<speak>' +
  '<par>' +
  '  <media end="thetext.end">' +
  '    <audio src="https://actions.google.com/sounds/v1/animals/crows_caw_in_field.ogg" soundLevel="+20dB"></audio>' +
  '  </media>' +
  '  <media xml:id="thetext" begin="1s"> ' +
  '    ¡Hola! Soy Dron Johnson. Encantado de conocerte. ' +
  '    Estoy en las afueras de una mansión, donde los espíritus campan a sus anchas, ya que se ha abierto una puerta que lleva al inframundo.' +
  '    Voy a entrar yo solo, ya que es demasiado peligrosa para humanos. ' +
  '    Tú dame instrucciones y yo las ejecutaré. Voy a entrar. ' +
  '  </media>' +
  '</par>' +
  '<audio src="https://actions.google.com/sounds/v1/doors/opening_closing_heavy_door.ogg"  clipBegin="1s" clipEnd="6s"></audio>' +
  'De acuerdo, ya estoy en el recibidor. Aquí veo una estantería, un mural en la pared, un baúl y una mesa. ' +
  '<emphasis level="strong">Tenemos 20 minutos. ¡Rápido! Dime qué hacemos.</emphasis>' +
  '</speak>';

exports.DESCRIPCION_INFIERNO = '<speak>' +
  '  <par>' +
  '    <media begin="2s" soundLevel="-15dB" end="thetext.end">' +
  '      <audio src="https://actions.google.com/sounds/v1/horror/monster_alien_growl_pained.ogg"></audio>' +
  '      </media>' +
  '    <media end="thetext.end">' +
  '      <audio src="https://actions.google.com/sounds/v1/horror/ambient_hum_pitched.ogg"></audio>' +
  '    </media>' +
  '    <media begin="3s" xml:id="thetext" >' +
  '  Veo el infierno a través de la puerta creada por este artilugio.' +
  '  Miles de demoníacas figuras vuelan en un mar de fuego.' +
  '  A los lados de la puerta veo dos palancas. Una en cada extremo. Supongo que accionando las palancas podremos cerrar esta puerta.' +
  '    </media>' +
  '  </par>' +
  '</speak>';

exports.DESCRIPCION_MURAL = '<speak>' +
  '  <par>' +
  '    <media end="thetext.end" soundLevel="10dB">' +
  '      <audio src="https://actions.google.com/sounds/v1/foley/feeling_paper.ogg" clipBegin="9s"/>' +
  '      </media>' +
  '    <media xml:id="thetext" begin="3s">' +
  '  El mural parece de arte moderno. Se compone de 4 barras verticales de colores. De izquierda a derecha: <break strength="weak" time="500ms"/>Azul, rojo, verde y amarillo.' +
  '  <break strength="weak" time="500ms"/>' +
  'En pequeño, en una esquina, pone: ' +
  '  <break strength="weak" time="500ms"/>' +
  '  S' +
  '  <break strength="weak" time="500ms"/>E<break strength="weak" time="500ms"/>V<break strength="weak" time="500ms"/>E<break strength="weak" time="500ms"/>R<break strength="weak" time="500ms"/>L<break strength="weak" time="500ms"/>A' +
  '    </media>' +
  '    </par>' +
  '</speak>';

exports.DOOR_AUDIOS = [
  '<audio src="https://actions.google.com/sounds/v1/doors/creaking_wooden_door.ogg" clipEnd="2700ms"/>',
  '<audio src="https://actions.google.com/sounds/v1/doors/locked_doorknob_jiggle.ogg"/>',
  '<audio src="https://actions.google.com/sounds/v1/doors/wood_door_open_close.ogg"/>',
  '<audio src="https://actions.google.com/sounds/v1/doors/wood_door_open.ogg"/>'
];

exports.OPEN_ARCON_AUDIO = '<audio src="https://actions.google.com/sounds/v1/doors/wood_rattle.ogg" soundLevel="-5dB"/>' +
  '<prosody pitch="+2st" rate="medium" volume="x-loud">¡Bingo!</prosody>' +
  '<break time="500ms"></break>' +
  'El bául se abre. Hay un escudo con el dibujo de un lobo salvaje en su interior.' +
  '<emphasis level="reduced">Me lo llevo.</emphasis>';

exports.WOLF_AUDIO = '<audio src="https://actions.google.com/sounds/v1/animals/animal_bark_and_growl.ogg" clipEnd="2800ms"/>';

exports.WOLF_SHIELD_AUDIO = exports.WOLF_AUDIO +
  'El espíritu me ataca, así que preparo el escudo.' +
  '<audio src="https://actions.google.com/sounds/v1/impacts/windshield_hit_with_bar.ogg" clipEnd="2700ms"/>' +
  '<par>' +
  '  <media xml:id="theaudio" fadeOutDur="5s" end="thetext.end">' +
  '    <audio src="https://actions.google.com/sounds/v1/animals/dog_whining.ogg" clipBegin="7s" soundLevel="+25dB"/>' +
  '  </media>' +
  '  <media xml:id="thetext">' +
  'Al defenderme con el escudo, el lobo ha quedado herido y huye. ' +
  '    ¡Corre, lobo, corre!' +
  '  </media>' +
  '</par>';

exports.FIRE_AUDIO = '<par>' +
  '<media xml:id="fire" end="grito.end">' +
  '  <audio src="https://actions.google.com/sounds/v1/ambiences/fire.ogg" soundLevel="+25dB"/>' +
  '  </media>' +
  '  <media xml:id="grito">' +
  '  <audio src="https://actions.google.com/sounds/v1/horror/aggressive_zombie_snarls.ogg"  soundLevel="-20dB" clipEnd="2700ms"/>' +
  '</media>' +
  '</par>';

exports.FIRE_KILL_AUDIO = '<par>' +
  '  <media xml:id="theaudio" end="thetext.end">' +
  '    <audio src="https://actions.google.com/sounds/v1/water/fountain_water_bubbling.ogg"/>' +
  '  </media>' +
  '  <media xml:id="thetext" begin="1s">' +
  '    El agua empieza a burbujear... De repente... ' +
  '  </media>' +
  '</par>' +
  '<par>' +
  '  <media>' +
  '    <audio src="https://actions.google.com/sounds/v1/impacts/crash.ogg"/>' +
  '  </media>' +
  '  <media begin="1s">' +
  '    ¡Explota!' +
  '  </media>' +
  '</par>' +
  'El espíritu de fuego se desintegra. ¡Bien hecho!';

exports.CLOSE_HELL_AUDIO = ' <speak>' +
  '  <par>' +
  '   <media begin="2s" soundLevel="-15dB" end="thetext.end-3s" fadeOutDur="6s">' +
  '      <audio src="https://actions.google.com/sounds/v1/horror/monster_alien_growl_pained.ogg"></audio>' +
  '   </media>' +
  '   <media end="thetext.end-3s"  fadeOutDur="6s">' +
  '      <audio src="https://actions.google.com/sounds/v1/horror/ambient_hum_pitched.ogg"></audio>' +
  '   </media>' +
  '   <media begin="3s" xml:id="thetext" >Ven, rápido, ya puedes entrar, no hay peligro.' +
  '     <break time="1s"/>' +
  '     <audio src="https://actions.google.com/sounds/v1/doors/opening_closing_heavy_door.ogg"  clipBegin="3s" clipEnd="6s"/>' +
  '     ¡Ven, estoy aquí!' +
  '     <break time="3s"/>' +
  '     Vamos a tirar de las palancas y cerremos la puerta al infierno. Yo de esta y tú de aquella.  Un poco más.' +
  '      <break time="1s"/>' +
  '      ¡Bien! Lo logramos.' +
  '  </media>' +
  '  </par>' +
  '  <par>' +
  '    <media end="earthtext.end" fadeOutDur="4s">' +
  '       <audio src="https://mansion-espiritus-lkgoxs.firebaseapp.com/sounds/earthquake-v2.mp3"/>' +
  '    </media>' +
  '    <media begin="2s" xml:id="earthtext">' +
  '    Un momento, ¿qué está pasando?' +
  '      <break time="1500ms"/>' +
  '    ¡Un terremoto! Cuidado, se está abriendo una grieta en el suelo.' +
  '    </media>' +
  '  </par>' +
  '    <audio src="https://actions.google.com/sounds/v1/impacts/crash_impact_sweetener.ogg"/>' +
  '  ¿Te encuentras bien? Veo que acabas de caerte por la grieta al sótano que está bajo el dormitorio.  Espera, que ahora bajo yo también.' +
  '  <par>' +
  '     <media>' +
  '       <audio src="https://actions.google.com/sounds/v1/transportation/space_craft_passing_pulse_stutter.ogg" clipBegin="1s"/>' +
  '     </media>  ' +
  '     <media begin="1500ms">' +
  '       <prosody rate="fast">' +
  '       Vaya, veo que has tenido un buen accidente. No, no te muevas. En el estado en el que estás, creo que solo te quedan 10 minutos antes de perder el conocimiento y morir. Tú no puedes moverte, pero yo sí. Puedo volver a subir al dormitorio, mirar en sótano, ¡Lo que digas! ¡Rápido! Dime qué hacemos y salgamos de aquí, para que pueda buscar ayuda.  ' +
  '       </prosody>' +
  '     </media>  ' +
  '   </par>' +
  '</speak>';


exports.OPEN_CAJAFUERTE_AUDIO = '<audio src="https://actions.google.com/sounds/v1/cartoon/pop.ogg"/>' +
  '<prosody pitch="+2st" rate="medium" volume="x-loud">¡Bingo!</prosody>' +
  'La caja fuerte se abre. Dentro hay una llave. La cojo sin dudar.';

exports.THE_END = '<speak><audio src="https://actions.google.com/sounds/v1/doors/key_in_lock.ogg" clipEnd="3s"/>' +
  '<prosody pitch="+2st" rate="medium" volume="x-loud">¡Sí!</prosody>' +
  'La puerta se ha abierto. La ambulancia ya está fuera. ¡Estás salvado! ' +
  '¡Y también hemos salvado a la humanidad! ' +
  'Encantado de haber trabajado en un nuevo caso contigo. ' +
  'Recuerda que este juego está basado en el universo del juego de cartas de ' +
  ' Mallory Mansion.' +
  'Búscalo en la web y cómpralo, no lo dudes. ¡Hasta pronto!</speak>';
