// @ts-nocheck
import Fixtures from "../models/fixtures";
import Teams from "../models/teams";

const searchByStatus = (status: String, filteredFixtures: Array<any>) => {
  const data = filteredFixtures.filter((teams) => {
    if (teams.status === status) {
      return true;
    }
    return false;
  });
  return data;
};

export const searchFunction = (req, res, next) => {
  const {
    query: { name, status },
  } = req;

  Teams.find({ name })
    .then((team) => {
      if (team.length === 0) {
        return res.status(500).json({message: "Fixture not found!"});
      }
      Fixtures.find({ $or: [{ homeTeam: name }, { awayTeam: name }] }).then(
        (fixture) => {
          const teams = {
            team: team,
            fixtures: fixture,
          };

          // if fixture is available in the query field
          if (status) {
            const filteredFixtures = searchByStatus(status, fixture);
            return res.status(200).json({
              ["SearchResult"]: { ...teams, fixtures: filteredFixtures },
            });
          }

          // It returns only the team queries results
          return res.status(200).json({
            ["SearchResult"]: { team },
          });
        }
      );
    })
    .catch((err) => next(err));
};
