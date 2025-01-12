#! /usr/bin/env node

import { Command } from 'commander';
import { readFile, writeFile } from './utils/utils.js';

const program = new Command();

program
  .command('show')
  .option('--asc')
  .option('--desc')
  .action(async (option) => {
    const expenses = (await readFile('expenses.json', true)) || [];
    if (expenses.length === 0) {
      console.log('no expenses to show');
      return;
    }

    if (option.asc)
      expenses.sort((a, b) => new Date(a.date) - new Date(b.date));
    if (option.desc)
      expenses.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log(expenses);
  });

program
  .command('add')
  .argument('<category>')
  .argument('<price>')
  .action(async (category, price) => {
    try {
      const expenses = (await readFile('expenses.json', true)) || [];

      const isExistedExpense = expenses.find(
        (expense) => expense.category === category
      );

      if (isExistedExpense) {
        console.log('this expense already exist');
        return;
      }

      if (Number(price) < 10) {
        console.log(
          'price is not in range, please choose a different price above 10'
        );
        return;
      }
      const index = expenses[expenses.length - 1]?.id || 0;

      const newExpense = {
        price,
        category,
        id: index + 1,
        date: new Date().toISOString(),
      };
      expenses.push(newExpense);

      await writeFile('expenses.json', expenses, true);
    } catch (err) {
      console.error(err);
    }
  });

program
  .command('price')
  .option('--asc')
  .option('--desc')
  .action(async (option) => {
    const expenses = (await readFile('expenses.json', true)) || [];
    if (expenses.length === 0) {
      console.log('no expenses to show');
      return;
    }

    if (option.asc) expenses.sort((a, b) => (a.price = b.price));
    if (option.desc) expenses.sort((a, b) => (b.price = a.price));

    console.log(expenses);
  });

program
  .command('delete')
  .argument('<id>')
  .action(async (id) => {
    const expenses = (await readFile('expenses.json', true)) || [];
    if (expenses.length === 0) {
      console.log('no expenses to show');
      return;
    }

    const index = expenses.findIndex((el) => el.id === +id);

    if (index !== -1) expenses.splice(index, 1);

    await writeFile('expenses.json', expenses, true);
    console.log('deleted successfully');
  });

program
  .command('update')
  .argument('<id>')
  .argument('<category>')
  .argument('<price>')
  .action(async (id, category, price) => {
    const expenses = (await readFile('expenses.json', true)) || [];
    if (expenses.length === 0) {
      console.log('no expenses to update');
      return;
    }

    const updateIndex = expenses.findIndex((el) => el.id === +id);
    if (updateIndex === -1) {
      console.log('no expense with this id');
      return;
    }

    if (category) expenses[updateIndex].category = category;
    if (price) expenses[updateIndex].price = Number(price);

    await writeFile('expenses.json', expenses, true);
  });

program
  .command('getById')
  .argument('<id>')
  .action(async (id) => {
    const expenses = (await readFile('expenses.json', true)) || [];
    if (expenses.length === 0) {
      console.log('no expenses to update');
      return;
    }

    const expense = expenses.find((exp) => exp.id === Number(id));
    if (!expense) {
      console.log('no expense with this id');
    }
    console.log(expense);
  });
program.parse();
