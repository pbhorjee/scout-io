/**
 * Using Rails-like standard naming convention for endpoints.
 * GET     /api/projects              ->  index
 * POST    /api/projects              ->  create
 * GET     /api/projects/:id          ->  show
 * PUT     /api/projects/:id          ->  update
 * DELETE  /api/projects/:id          ->  destroy
 */

'use strict';

var _ = require('lodash');
var sqldb = require('../../sqldb');
var Project = sqldb.Project;
var Folder = sqldb.Folder;

function handleError(res, statusCode) {
  statusCode = statusCode || 500;
  return function(err) {
    res.status(statusCode).send(err);
  };
}

function responseWithResult(res, statusCode) {
  statusCode = statusCode || 200;
  return function(entity) {
    if (entity) {
      res.status(statusCode).json(entity);
    }
  };
}

function handleEntityNotFound(res) {
  return function(entity) {
    if (!entity) {
      res.status(404).end();
      return null;
    }
    return entity;
  };
}

function saveUpdates(updates) {
  return function(entity) {
    return entity.updateAttributes(updates)
      .then(function(updated) {
        return updated;
      });
  };
}

function removeEntity(res) {
  return function(entity) {
    if (entity) {
      return entity.destroy()
        .then(function() {
          res.status(204).end();
        });
    }
  };
}

// Gets a list of Projects
exports.index = function(req, res) {
  Project.findAll()
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Gets a single Project from the DB
exports.show = function(req, res) {
  Project.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Creates a new Project in the DB
exports.create = function(req, res) {
  Project.create(req.body)
    .then(responseWithResult(res, 201))
    .catch(handleError(res));
};

// Updates an existing Project in the DB
exports.update = function(req, res) {
  if (req.body._id) {
    delete req.body._id;
  }
  Project.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(saveUpdates(req.body))
    .then(responseWithResult(res))
    .catch(handleError(res));
};

// Deletes a Project from the DB
exports.destroy = function(req, res) {
  Project.find({
    where: {
      _id: req.params.id
    }
  })
    .then(handleEntityNotFound(res))
    .then(removeEntity(res))
    .catch(handleError(res));
};

/**
 * Get project folders
 */

exports.folders = function(req, res) {
  Project.find({
      where: {
        _id: req.params.id
      }
    })
    .then(function(project) {
      if (!project) {
        return res.status(401).end();
      }
      project.getFolders().then(function (folders) {
        res.json(folders);
      });
    })
    .catch(function(err) {
      return next(err);
    });
};

