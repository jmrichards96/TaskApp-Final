const models = require('../models');

const Board = models.Board;

// Renders the boards page
const makerPage = (req, res) => res.render('app', { csrfToken: req.csrfToken() });

// Creates a new board from form input
const makeBoard = (req, res) => {
  if (!req.body.name) {
    return res.status(400).json({ error: 'Name required' });
  }

  const boardData = {
    name: req.body.name,
    owner: req.session.account._id,
  };

  const newBoard = new Board.BoardModel(boardData);

  const boardPromise = newBoard.save();

  boardPromise.then(() => res.json({ redirect: '/boards' }));

  boardPromise.catch((err) => {
    console.log(err);
    if (err.code === 11000) {
      return res.status(400).json({ error: 'Board already exists.' });
    }

    return res.status(400).json({ error: 'An error occurred' });
  });

  return boardPromise;
};

// deletes a board with the provided id
const deleteBoard = (req, res) => {
  if (!req.body.boardID) {
    return res.status(400).json({ error: 'Missing board ID' });
  }
  return Board.BoardModel.remove({ _id: req.body.boardID }, (err) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }
    return res.json({ redirect: '/boards' });
  });
};

// gets all of the boards for the current user
const getBoards = (request, response) => {
  const req = request;
  const res = response;

  return Board.BoardModel.findByOwner(req.session.account._id, (err, docs) => {
    if (err) {
      console.log(err);
      return res.status(400).json({ error: 'An error occurred' });
    }

    return res.json({ boards: docs });
  });
};

module.exports.makerPage = makerPage;
module.exports.getBoards = getBoards;
module.exports.make = makeBoard;
module.exports.delete = deleteBoard;
