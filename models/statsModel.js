const mongoose = require('mongoose');

const statsSchema = mongoose.Schema(
    {
        userEmail: 'String',
        dateStats: [
            {
                date: 'String',
                rounds: 'Number',
                roundTime: 'Number',
                weekDay: 'String'
            }
        ],
        labelStats: [
            {
                label: 'String',
                color: 'String',
                dates: [
                    {
                        date: 'String',
                        rounds: 'Number',
                        roundTime: 'Number',
                        weekDay: 'String'
                    }
                ]
            }
        ],
        labelList: [
            {
                label: 'String',
                color: 'String'
            }
        ]
    }
);

const Stats = mongoose.model('Stats', statsSchema);

module.exports = Stats; 