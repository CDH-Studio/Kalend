export const grabSampleData = () =>  {
	fetch('http://35.183.68.195:8080/api/test')
		.then(res =>  {
			return res.json();
		})
		.then( data => {
			//console.log('data', data);
			return data;
		}).catch(error => {
			console.log('error', error);
		});
}; 

export const grabUserData = () =>  {
	fetch('http://35.183.68.195:8080/api/users')
		.then(res =>  {
			return res.json();
		})
		.then( data => {
			console.log('data', data);
			return data;
		}).catch(error => {
			console.log('error', error);
		});
}; 