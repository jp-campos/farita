import usersModel from "../models/usersModel";

const usersController = {
  getAll: async (req, res, ) => {
    usersModel.find({}, (err, users) => {
      if (err) {
        return res.json(err);
      }

      res.json(users);
    });
  },

  getOne: (req, res, ) => {
    usersModel.findById(req.params.id, (err, user) => {
      if (err) {
        return res.json(err);
      }

      res.json(user || {});
    });
  },

  create: (req, res, ) => {
    usersModel.create(req.body, (err, user) => {
      if (err) {
        return res.json(err);
      }

      res.json(user);
    });
  },

  update: (req, res, ) => {
    usersModel.findOneAndUpdate(
      req.params.id,
      req.body,
      { new: true },
      (err, user) => {
        if (err) {
          return res.json(err);
        }

        res.json(user);
      },
    );
  },

  delete: (req, res, ) => {
    usersModel.remove({ _id: req.params.id }, (err, ) => {
      if (err) {
        return res.json(err);
      }
    });
    res.json(true);
  },
};

export default usersController;
