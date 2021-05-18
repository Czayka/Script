var modifiedHeaders = $request.headers;

var modifiedBodys = $request.body;

modifiedHeaders['device-id'] = '1636b97d05b453db65b451aa1424bab2';

modifiedBodys['promo_code'] = '1'

$done({headers : modifiedHeaders});
