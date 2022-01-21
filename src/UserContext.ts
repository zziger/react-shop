import { User } from "../models/User";
import React from 'react';

export const UserContext = React.createContext<User | null>(null);