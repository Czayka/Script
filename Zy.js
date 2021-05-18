var modifiedHeaders = $request.headers;


modifiedHeaders['device-id'] = '1636b97d05b453db65b451aa1424bab2';

$done({headers : modifiedHeaders});
