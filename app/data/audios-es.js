exports.HELLO = '<speak>' +
  '<par>' +
  '  <media end="thetext.end">' +
  '    <audio src="https://actions.google.com/sounds/v1/ambiences/outdoor_sounds_with_whirr.ogg"></audio>' +
  '  </media>' +
  '  <media end="thetext.end">' +
  '    <audio src="https://actions.google.com/sounds/v1/animals/crows_caw_in_field.ogg" ></audio>' +
  '  </media>' +
  '  <media xml:id="thetext" begin="1s"> ' +
  '    Soy Dron Johnson, soy un dron y debes darme instrucciones para resolver esta amenaza.' +
  '    Estoy en las afueras de una mansión, donde debemos cerrar la puerta que se ha abierto al inframundo, según tengo entendido, en el dormitorio.' +
  '    Voy a entrar yo solo, ya que es demasiado peligrosa para humanos. ' +
  '  </media>' +
  '</par>' +
  '<audio src="https://actions.google.com/sounds/v1/doors/opening_closing_heavy_door.ogg"  clipBegin="1s" clipEnd="6s"></audio>' +
  'Vale, estoy en el recibidor, donde se ve una estantería, un mural en la pared, un baúl y una mesa. ' +
  '<emphasis level="strong">Tenemos 15 minutos. ¡Rápido! Dime qué hacemos.</emphasis>' +
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
