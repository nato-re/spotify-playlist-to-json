// Contar quantas musicas tém cada artista na playlist? - Agrupa pelo nome do artista e soma cada aprição
db.songs.aggregate([
  { $group: { _id: "$artist.artist_name", count: { $sum: 1 } } }
])
// Ordernar pelas que tem mais? ordena
db.songs.aggregate([
  { $group: { _id: "$artist.artist_name", count: { $sum: 1 } } },
  { $sort: { count: -1 } }
])
// Ver a duração total da playlist? Agrupa todos o documentos e soma 
db.songs.aggregate([
  { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
])
// E se fosse em minutos?
db.songs.aggregate([
  { $group: { _id: null, totalDuration: { $sum: "$duration" } } },
  { $project: { totalDurationInMinutes: { $divide: ['$totalDuration', 60] } } }
])
// Top 5 generos com mais músicas
db.songs.aggregate([
  { $unwind: "$album.genre" },
  {
    $group: {
      _id: '$album.genre',
      artists: { $addToSet: "$artist.artist_name" }
    }
  },
  {
    $project: {
      genre: '$_id',
      count: { $size: "$artists" },
      // artists: 1
    }
  },
  { $sort: { count: -1 } },
  { $limit: 5 }
]).pretty();


// Top 10 musicas adicionas na playlist 
db.songs.aggregate([
  { $group: { _id: "$userId", musicasAdicionadas: { $sum: 1 } } },
  { $sort: { musicasAdicionadas: - 1 } },
  {
    $lookup: {
      from: "users",
      localField: "userId",
      foreignField: "id",
      as: "userData"
    }
  },
  {
    $lookup: {
      from: "users",
      localField: "_id",
      foreignField: "id",
      as: "userData"
    }
  },
  { $unwind: "$userData" },
  { $project: { name: "$userData.display_name", followers: '$userData.followers', musicasAdicionadas: 1 } },
  { $limit: 10 }
]).pretty();

db.songs.aggregate([
  { $group: { _id: "$userId", musicasAdicionadas: { $sum: 1 }, duration: { $sum: { $divide: ["$duration", 3600] } } } },
  { $sort: { musicasAdicionadas: - 1 } },
  { $lookup: { from: "users", localField: "userId", foreignField: "id", as: "userData" } }, { $lookup: { from: "users", localField: "_id", foreignField: "id", as: "userData" } },
  { $unwind: "$userData" },
  { $project: { name: "$userData.display_name", followers: '$userData.followers.total', pecentage: { $divide: ['$duration', 30] }, musicasAdicionadas: 1 } },
  { $limit: 10 }]).pretty();


// - Top 10 inserção de musicas na playlist 
// - Total de horas que a pessoa adicionou 
// - O que esse total de minutos representa na playlist em porcetagem do total de duração da playlist
// - Ordenar pela porcetagem de tempo adicionado na playlist em minutos e adicionar quantidade de followers
// - Top 7 inserção por genêro musical 

//   {$project: { name: {  $arrayElemAt: ["$userData", 0]} }},
