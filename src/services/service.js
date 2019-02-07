export const grabSampleData = () =>  {
	fetch('http://172.16.119.156:3000/api/test')
		.then(res =>  {
			res.json().then(data => {
				return data;
			});
		}).catch(error => {
			console.log('error', error);
		});
};
