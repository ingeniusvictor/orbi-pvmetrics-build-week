import type { SyntheticPlant } from '../contracts/plantContracts';

const clone = <T>(value: T): T => JSON.parse(JSON.stringify(value)) as T;

export type PlantRegistry = {
  list(): SyntheticPlant[];
  getById(plantId: string): SyntheticPlant | undefined;
};

export const createPlantRegistry = (plants: SyntheticPlant[]): PlantRegistry => {
  const source = clone(plants);
  return {
    list: () => clone(source).sort((a, b) => Number(a.metadata.displayOrder) - Number(b.metadata.displayOrder)),
    getById: (plantId) => {
      const plant = source.find((item) => item.id === plantId);
      return plant ? clone(plant) : undefined;
    },
  };
};
