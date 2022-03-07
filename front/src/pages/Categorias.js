import React, { useEffect, useState } from "react";
import Categorias from "../components/categorias/Categorias";

import { useParams } from "react-router-dom";

const CategoriasPage = () => {
  const { username, farita } = useParams();

  return <Categorias username={username} faritaId={farita} />;
};
export default CategoriasPage;
