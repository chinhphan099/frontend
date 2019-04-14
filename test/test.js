module('isPhoneNumber');

function isPhoneNumber(input){
  return /^\d+$/.test(input);
}

function getYoutubeId(url) {
  var regExp = /^.*((youtu.be\/)|(v\/)|(\/u\/\w\/)|(embed\/)|(watch\?))\??v?=?([^#\&\?]*).*/,
    match = url.match(regExp);
  return (match && match[7].length === 11) ? match[7] : false;
}

test('Wrong number', function() {
  equal(isPhoneNumber('abc123'), false, 'All alphabet');
  equal(isPhoneNumber('0123456789'), true, 'Input = 0123456789');
  equal(isPhoneNumber('090554321'), true, 'Input = 090554321');
});

test('idVideo', function() {
	equal(getYoutubeId('https://www.youtube.com/watch?v=rctU06lYxIc'), 'rctU06lYxIc', 'rctU06lYxIc')
	equal(getYoutubeId('https://youtu.be/rctU06lYxIc'), 'rctU06lYxIc', 'rctU06lYxIc')
});