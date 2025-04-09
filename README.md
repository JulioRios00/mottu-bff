## BFF Mottu

Hey, tudo bem? Meu nome é Julio e esse é meu teste para vaga de dev na Mottu.

O código foi implementado tentando seguir a maioria das specs citadas no descritivo do teste.

## Para rodar o projeto:

_Você pode rodar o projeto de duas maneiras_

- Utilizando Docker:

```
docker compose up -d
```

- Diretamente pelo npm:

```
npm run start:dev
```

## Informações importantes

Nesse projeto consegui desenvolver até o nivel 2 descrito no teste, implementando testes unitários para os serviços, criando os filtros para raças e personagens e também o endpoint de breeds.

Apesar de novo para mim, tentei aplicar os conceitos de Clean Architecture da melhor maneira possível, criando módulos para _cats_, _rickandmorty_ e _pairs_.

Utilizei o padrão Adapter para isolar as requests com as API's e utilizei da injeção de dependências do Nestjs para diminuir o acoplamento do código.

Nesse projeto, utilizei de memória em cache para minimizar a quantidade de chamadas externas e também adicione tempos de cache para (por exemplo, this.cacheService.set(cacheKey, breeds, 86400))

## Endpoints

_Par aleatório_

GET http://localhost:3000/v1/pairs

Resposta aleatória:
{
	"character": {
			"id": 548,
			"name": "Truckula",
			"image": "https://rickandmortyapi.com/api/character/avatar/548.jpeg",
			"species": "Mythological Creature"
		},
			"cat": {
			"id": "duh",
			"image": "https://cdn2.thecatapi.com/images/duh.jpg"
		}
}

_Filtro por personagem e raça_

GET http://localhost:3000/v1/pairs/search?characterName=Morty&catBreed=aeg

[
	{
		"character": {
			"id": 21,
			"name": "Aqua Morty",
			"image": "https://rickandmortyapi.com/api/character/avatar/21.jpeg",
			"species": "Humanoid"
		},
		"cat": {
			"id": "uvt2Psd9O",
			"image": "https://cdn2.thecatapi.com/images/uvt2Psd9O.jpg"
		}
	},
	...
]

_Raças_

GET http://localhost:3000/v1/breeds


[
	{
        "id": "abys",
        "name": "Abyssinian"
    },
    {
        "id": "aege",
        "name": "Aegean"
    }, 
	...
]

## Como rodar o projeto

### Utilizando Docker 

```
	docker compose up
```

### Rodando diretamente pelo terminal

```
	npm run start:dev
```

### Testes

```
npm run test
```