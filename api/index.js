const app = require('express')()
const bodyParser = require('body-parser')
app.use(bodyParser.json());

const https = require('https');

const userStories = 
[
	{
		id: '1111',
		title: 'Implement authentication',
		stage: 'toDo',
		imageUrl: 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_01_ToDo.jpg'
	},
	{
		id: '2222',
		title: 'Write unit tests',
		stage: 'toDo',
		imageUrl: 'https://blog.geekitude.com/wp-content/uploads/2022/09/TicketStage_01_ToDo.jpg'
	}
];

app.set('port', (process.env.PORT || 8085));


app.get('/api/userstories', (req, res) => {
	try {			
		res.send(userStories);
	}
	catch(err) {
		var errMessage = `${err}`;
		processErrorResponse(res, 500, errMessage);
	}
	// processErrorResponse(res, 500, "A friendly error");
})
	
function processErrorResponse(res, statusCode, message) {
	console.log(`${statusCode} ${message}`);
	res.status(statusCode).send({
		error: {
			status: statusCode,
			message: message
		},
	});
}	

app.listen(app.get('port'), function() {
  console.log('Express app redux-toolkit-tickets is running on port', app.get('port'));
});

module.exports = app